import { URLCheckResult } from "@/types";

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

// Compute a safety score between 0 and 1
const computeSafetyScore = (url: string): number => {
  let score = 1.0;
  
  // Long URLs are more suspicious
  if (url.length > 75) score -= 0.2;
  
  // URLs with many dots are suspicious
  if (countDots(url) > 3) score -= 0.2;
  
  // URLs with many dashes are suspicious
  if (countDashes(url) > 2) score -= 0.15;
  
  // URLs without HTTPS are suspicious
  if (!url.startsWith('https://')) score -= 0.3;
  
  // URLs with suspicious keywords are very suspicious
  if (hasSuspiciousPattern(url)) score -= 0.4;
  
  // Random variation to simulate ML model uncertainty
  score += (Math.random() * 0.1) - 0.05;
  
  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, score));
};

export const checkURL = async (url: string): Promise<URLCheckResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const score = computeSafetyScore(url);
  
  const result = {
    url,
    isSafe: score > 0.5,
    score,
    timestamp: new Date(),
    features: {
      length: url.length,
      hasSuspiciousKeywords: hasSuspiciousPattern(url),
      hasHttps: url.startsWith('https://'),
      numDots: countDots(url),
      numDashes: countDashes(url)
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
