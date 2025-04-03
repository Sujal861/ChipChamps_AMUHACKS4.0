
export interface URLCheckResult {
  url: string;
  isSafe: boolean;
  score: number;
  timestamp: Date;
  threatLevel?: "safe" | "low" | "medium" | "high";
  confidenceScore?: number;
  inBlacklist?: boolean;
  features?: {
    length: number;
    hasSuspiciousKeywords: boolean;
    hasHttps: boolean;
    numDots: number;
    numDashes: number;
    hasExcessiveSubdomains?: boolean;
    hasIpAddress?: boolean;
    specialCharCount?: number;
  };
}

export type Theme = 'light' | 'dark' | 'system';

export interface ChromeMessage {
  action: string;
  [key: string]: any;
}

export interface ExtensionSettings {
  autoScanEnabled: boolean;
  darkModeEnabled: boolean;
}
