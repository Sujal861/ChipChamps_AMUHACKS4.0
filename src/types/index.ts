
export interface URLCheckResult {
  url: string;
  isSafe: boolean;
  score: number;
  timestamp: Date;
  threatLevel?: "safe" | "low" | "medium" | "high";
  confidenceScore?: number;
  inBlacklist?: boolean;
  scanSpeed?: number; // Time in ms it took to scan
  features?: {
    length: number;
    hasSuspiciousKeywords: boolean;
    hasHttps: boolean;
    numDots: number;
    numDashes: number;
    hasExcessiveSubdomains?: boolean;
    hasIpAddress?: boolean;
    specialCharCount?: number;
    domainAge?: number; // Age of domain in days
    securityHeaders?: {
      hasHSTS: boolean;
      hasXFrameOptions: boolean;
      hasContentSecurityPolicy: boolean;
    };
  };
  apiSource?: "local" | "googleSafeBrowsing" | "openPhish"; // Tracking which API provided the result
  userReported?: boolean; // If this URL was reported by a user
}

export type Theme = 'light' | 'dark' | 'system';

export interface ChromeMessage {
  action: string;
  [key: string]: any;
}

export interface ExtensionSettings {
  autoScanEnabled: boolean;
  darkModeEnabled: boolean;
  notificationsEnabled?: boolean; // New setting for enabling/disabling notifications
  privacyMode?: boolean; // New setting for enhanced privacy
  apiPreference?: "googleSafeBrowsing" | "openPhish" | "both"; // Which API to use
  scanFrequency?: "always" | "hourly" | "daily"; // How often to auto-scan
}

export interface UserFeedback {
  url: string;
  reportType: "phishing" | "false_positive" | "malware" | "other";
  comment?: string;
  timestamp: Date;
  userEmail?: string; // Optional email for feedback
}

// New interfaces for API integrations
export interface SafeBrowsingApiResponse {
  matches?: {
    threatType: string;
    platformType: string;
    threat: { url: string };
    cacheDuration: string;
    threatEntryType: string;
  }[];
}

export interface OpenPhishApiResponse {
  url: string;
  inDatabase: boolean;
  firstSeen?: string;
  lastSeen?: string;
}
