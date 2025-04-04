import { URLCheckResult } from "@/types";
import { isExtension } from "./chromeUtils";

// List of patterns often found in phishing URLs
const suspiciousKeywords = [
  "secure", "account", "banking", "login", "signin", "verify", "support",
  "update", "confirm", "verification", "authenticate", "wallet", "alert"
];

// Check if URL contains suspicious keywords in non-branded contexts
const hasSuspiciousPattern = (url: string): boolean => {
  const lowerUrl = url.toLowerCase();
  return suspiciousKeywords.some(keyword => 
    lowerUrl.includes(keyword) && 
    !lowerUrl.includes("google") && 
    !lowerUrl.includes("facebook") && 
    !lowerUrl.includes("microsoft") && 
    !lowerUrl.includes("apple")
  );
};

// Count the number of dots in a URL
const countDots = (url: string): number => {
  return (url.match(/\./g) || []).length;
};

// Count the number of dashes in a URL
const countDashes = (url: string): number => {
  return (url.match(/-/g) || []).length;
};

// Count special characters in URL
const countSpecialChars = (url: string): number => {
  return (url.match(/[^a-zA-Z0-9.-]/g) || []).length;
};

// Check for excessive subdomains
const hasExcessiveSubdomains = (url: string): boolean => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.split('.').length > 3;
  } catch {
    return false;
  }
};

// Check for IP address in URL
const hasIpAddress = (url: string): boolean => {
  const ipPattern = /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
  return ipPattern.test(url);
};

// Enhanced ML-based threat detection (simulated)
const analyzeThreatLevel = (url: string): {
  threatLevel: "safe" | "low" | "medium" | "high";
  score: number;
  confidence: number;
} => {
  // This simulates an ML model's confidence score between 0-1
  let baseScore = 1.0;
  let confidence = 0.95;
  let analysisFlags = 0;
  
  // URL Length (long URLs more suspicious)
  if (url.length > 100) {
    baseScore -= 0.2;
    analysisFlags++;
  } else if (url.length > 75) {
    baseScore -= 0.1;
    analysisFlags++;
  }
  
  // Special character analysis
  if (countDots(url) > 3) {
    baseScore -= 0.15;
    analysisFlags++;
  }
  
  if (countDashes(url) > 2) {
    baseScore -= 0.1;
    analysisFlags++;
  }
  
  if (countSpecialChars(url) > 5) {
    baseScore -= 0.15;
    analysisFlags++;
  }
  
  // Domain analysis
  if (hasExcessiveSubdomains(url)) {
    baseScore -= 0.2;
    analysisFlags++;
  }
  
  if (hasIpAddress(url)) {
    baseScore -= 0.3;
    analysisFlags++;
  }
  
  // Protocol analysis
  if (!url.startsWith('https://')) {
    baseScore -= 0.25;
    analysisFlags++;
  }
  
  // Content keyword analysis
  if (hasSuspiciousPattern(url)) {
    baseScore -= 0.35;
    analysisFlags++;
  }
  
  // Reduce confidence based on the number of flags triggered
  // More flags = less certain about the classification
  confidence = Math.max(0.7, confidence - (analysisFlags * 0.02));
  
  // Add some randomness to simulate model uncertainty
  baseScore += (Math.random() * 0.1) - 0.05;
  
  // Clamp score between 0 and 1
  const finalScore = Math.max(0, Math.min(1, baseScore));
  
  // Determine threat level based on score
  let threatLevel: "safe" | "low" | "medium" | "high";
  if (finalScore > 0.8) {
    threatLevel = "safe";
  } else if (finalScore > 0.6) {
    threatLevel = "low";
  } else if (finalScore > 0.3) {
    threatLevel = "medium";
  } else {
    threatLevel = "high";
  }
  
  return {
    threatLevel,
    score: finalScore,
    confidence
  };
};

// Check URL against blacklist via Chrome extension API (if available)
const checkBlacklist = async (url: string): Promise<boolean> => {
  try {
    if (isExtension()) {
      // Check with extension service worker
      const response = await new Promise<any>((resolve) => {
        if (window.chrome?.runtime?.sendMessage) {
          window.chrome.runtime.sendMessage({ action: "checkBlacklist", url }, (response) => {
            resolve(response);
          });
        } else {
          resolve({ inBlacklist: false });
        }
      });
      
      return response?.inBlacklist || false;
    }
    
    // Fallback for non-extension context
    return false;
  } catch (error) {
    console.error("Error checking blacklist:", error);
    return false;
  }
};

export const checkURL = async (url: string): Promise<URLCheckResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Check blacklist first (fast path)
  const inBlacklist = await checkBlacklist(url);
  
  // If in blacklist, no need for full analysis
  if (inBlacklist) {
    const result: URLCheckResult = {
      url,
      isSafe: false,
      score: 0.1, // Very low safety score for blacklisted URLs
      threatLevel: "high",
      confidenceScore: 0.95,
      timestamp: new Date(),
      inBlacklist: true,
      features: {
        length: url.length,
        hasSuspiciousKeywords: true,
        hasHttps: url.startsWith('https://'),
        numDots: countDots(url),
        numDashes: countDashes(url),
        hasExcessiveSubdomains: hasExcessiveSubdomains(url),
        hasIpAddress: hasIpAddress(url),
        specialCharCount: countSpecialChars(url)
      }
    };
    
    saveToHistory(result);
    return result;
  }
  
  // Perform full analysis
  const analysis = analyzeThreatLevel(url);
  
  const result: URLCheckResult = {
    url,
    isSafe: analysis.threatLevel === "safe" || analysis.threatLevel === "low",
    score: analysis.score,
    threatLevel: analysis.threatLevel,
    confidenceScore: analysis.confidence,
    timestamp: new Date(),
    inBlacklist: false,
    features: {
      length: url.length,
      hasSuspiciousKeywords: hasSuspiciousPattern(url),
      hasHttps: url.startsWith('https://'),
      numDots: countDots(url),
      numDashes: countDashes(url),
      hasExcessiveSubdomains: hasExcessiveSubdomains(url),
      hasIpAddress: hasIpAddress(url),
      specialCharCount: countSpecialChars(url)
    }
  };

  // Save to localStorage history
  saveToHistory(result);
  
  return result;
};

// Save URL check result to localStorage history
export const saveToHistory = (result: URLCheckResult): void => {
  try {
    const historyKey = 'phish-check-history';
    const existingHistory = localStorage.getItem(historyKey);
    let history: URLCheckResult[] = [];
    
    if (existingHistory) {
      history = JSON.parse(existingHistory);
    }
    
    // Add new result at the beginning
    history.unshift(result);
    
    // Keep only last 20 items
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    
    localStorage.setItem(historyKey, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Load history from localStorage
export const loadHistory = (): URLCheckResult[] => {
  try {
    const historyKey = 'phish-check-history';
    const existingHistory = localStorage.getItem(historyKey);
    
    if (existingHistory) {
      const history = JSON.parse(existingHistory);
      // Convert string timestamps back to Date objects
      return history.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  
  return [];
};

// Clear history from localStorage
export const clearHistory = (): void => {
  try {
    localStorage.removeItem('phish-check-history');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
