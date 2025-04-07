
import { URLCheckResult } from "@/types";

// Database of known malicious domains (simplified mock)
const knownMaliciousDomains = [
  "malware.test", "phish.example", "badsite.com", "fakepaypal.com",
  "banking-secure-verify.com", "account-verify-signin.net", "secure-wallet-crypto.io",
  "login-account-verify.org", "document-share-view.com", "invoice-payment-secure.net"
];

// Database of trusted domains (simplified mock)
const trustedDomains = [
  "google.com", "microsoft.com", "apple.com", "amazon.com", "facebook.com",
  "github.com", "linkedin.com", "twitter.com", "instagram.com", "youtube.com"
];

// Simulate deep inspection of URL
export const performDeepLinkInspection = (url: string): {
  maliciousPayloadDetected: boolean;
  redirectsDetected: boolean;
  obfuscationTechniques: string[];
  finalScore: number;
} => {
  const lowerUrl = url.toLowerCase();
  const obfuscationTechniques = [];
  let maliciousScore = 0;
  
  // Check for URL shorteners (simplified)
  if (lowerUrl.includes('bit.ly') || lowerUrl.includes('tinyurl') || lowerUrl.includes('goo.gl')) {
    obfuscationTechniques.push('URL shortener');
    maliciousScore += 0.2;
  }
  
  // Check for typosquatting (simplified)
  if (lowerUrl.includes('googel') || lowerUrl.includes('micosoft') || lowerUrl.includes('facebok')) {
    obfuscationTechniques.push('Typosquatting');
    maliciousScore += 0.3;
  }
  
  // Check for data URI scheme
  if (lowerUrl.includes('data:text/html')) {
    obfuscationTechniques.push('Data URI scheme');
    maliciousScore += 0.4;
  }

  // Check for unusual character encoding
  if (lowerUrl.includes('%') || lowerUrl.includes('\\x')) {
    obfuscationTechniques.push('Unusual character encoding');
    maliciousScore += 0.25;
  }
  
  // Check for excessive subdomains
  const subdomainCount = (lowerUrl.match(/\./g) || []).length;
  if (subdomainCount > 3) {
    obfuscationTechniques.push('Excessive subdomains');
    maliciousScore += 0.15 * (subdomainCount - 3);
  }
  
  // Add some randomness to simulate variations
  maliciousScore += (Math.random() * 0.2) - 0.1;
  maliciousScore = Math.min(1, Math.max(0, maliciousScore));
  
  return {
    maliciousPayloadDetected: maliciousScore > 0.6,
    redirectsDetected: Math.random() > 0.7,
    obfuscationTechniques,
    finalScore: maliciousScore
  };
};

// Check domain reputation against our mock databases
export const checkDomainReputation = (url: string): {
  score: number;
  isMalicious: boolean;
  isTrusted: boolean;
  firstReportedDate?: Date;
  reportCount?: number;
} => {
  try {
    const hostname = new URL(url).hostname;
    
    // Check if it's in our known malicious domains
    const isMalicious = knownMaliciousDomains.some(domain => hostname.includes(domain));
    
    // Check if it's in our trusted domains
    const isTrusted = trustedDomains.some(domain => hostname.includes(domain));
    
    let score = 0.5; // Neutral score by default
    
    if (isMalicious) {
      score = Math.random() * 0.3; // 0 - 0.3 score for malicious
    } else if (isTrusted) {
      score = 0.7 + Math.random() * 0.3; // 0.7 - 1.0 score for trusted
    } else {
      // For unknown domains, score based on some heuristics
      score = 0.4 + Math.random() * 0.3; // 0.4 - 0.7 score for unknown
      
      // Adjust score based on domain age (simulation)
      if (hostname.length > 15) score -= 0.1; // Longer domains are slightly more suspicious
      if (hostname.includes('-')) score -= 0.05; // Domains with hyphens slightly more suspicious
    }
    
    return {
      score,
      isMalicious,
      isTrusted,
      // Simulate additional metadata for known malicious domains
      ...(isMalicious ? {
        firstReportedDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in last 90 days
        reportCount: Math.floor(Math.random() * 1000) + 10
      } : {})
    };
  } catch (error) {
    return {
      score: 0.2, // Very low score for invalid URLs
      isMalicious: false,
      isTrusted: false
    };
  }
};

// Comprehensive link analysis combining multiple techniques
export const analyzeLinkSafety = (url: string): {
  safetyScore: number;
  threatDetails: {
    maliciousPayload: boolean;
    obfuscationTechniques: string[];
    redirectChain: boolean;
    domainReputation: {
      score: number;
      isMalicious: boolean;
      isTrusted: boolean;
      firstReportedDate?: Date;
      reportCount?: number;
    };
  }
} => {
  // Perform deep inspection
  const deepInspection = performDeepLinkInspection(url);
  
  // Check domain reputation
  const domainReputation = checkDomainReputation(url);
  
  // Calculate overall safety score (weighted average)
  // 40% from domain reputation, 60% from deep inspection
  const safetyScore = (domainReputation.score * 0.4) + ((1 - deepInspection.finalScore) * 0.6);
  
  return {
    safetyScore,
    threatDetails: {
      maliciousPayload: deepInspection.maliciousPayloadDetected,
      obfuscationTechniques: deepInspection.obfuscationTechniques,
      redirectChain: deepInspection.redirectsDetected,
      domainReputation
    }
  };
};

// Enhanced URL check specifically for CyberShield Pro
export const cyberShieldProCheck = async (url: string): Promise<URLCheckResult> => {
  // Simulate network delay for enterprise analysis
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Get detailed link analysis
  const linkAnalysis = analyzeLinkSafety(url);
  
  // Convert the safety score to our standard format
  const score = linkAnalysis.safetyScore;
  
  // Determine threat level based on safety score
  let threatLevel: "safe" | "low" | "medium" | "high";
  if (score > 0.8) {
    threatLevel = "safe";
  } else if (score > 0.6) {
    threatLevel = "low";
  } else if (score > 0.4) {
    threatLevel = "medium";
  } else {
    threatLevel = "high";
  }
  
  // Enhanced feature analysis for enterprise results
  const result: URLCheckResult = {
    url,
    isSafe: score > 0.7, // Higher threshold for enterprise safety
    score,
    threatLevel,
    confidenceScore: 0.95, // Enterprise has higher confidence
    timestamp: new Date(),
    inBlacklist: linkAnalysis.threatDetails.domainReputation.isMalicious,
    scanSpeed: Math.floor(Math.random() * 500) + 100, // Scan speed in ms (100-600ms)
    features: {
      length: url.length,
      hasSuspiciousKeywords: true,
      hasHttps: url.startsWith('https://'),
      numDots: (url.match(/\./g) || []).length,
      numDashes: (url.match(/-/g) || []).length,
      hasExcessiveSubdomains: (url.match(/\./g) || []).length > 3,
      hasIpAddress: /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url),
      specialCharCount: (url.match(/[^a-zA-Z0-9.-]/g) || []).length,
      domainAge: Math.floor(Math.random() * 3650), // Random age between 0-10 years
      securityHeaders: {
        hasHSTS: Math.random() > 0.5,
        hasXFrameOptions: Math.random() > 0.4,
        hasContentSecurityPolicy: Math.random() > 0.6,
      }
    },
    apiSource: "local", // Mark as using our local sophisticated engine
    proData: {
      redirectChainDetected: linkAnalysis.threatDetails.redirectChain,
      obfuscationMethods: linkAnalysis.threatDetails.obfuscationTechniques,
      maliciousPayload: linkAnalysis.threatDetails.maliciousPayload,
      domainFirstReported: linkAnalysis.threatDetails.domainReputation.firstReportedDate,
      reportCount: linkAnalysis.threatDetails.domainReputation.reportCount
    }
  };
  
  return result;
};
