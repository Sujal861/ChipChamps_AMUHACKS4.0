
export interface URLCheckResult {
  url: string;
  isSafe: boolean;
  score: number;
  timestamp: Date;
  features?: {
    length: number;
    hasSuspiciousKeywords: boolean;
    hasHttps: boolean;
    numDots: number;
    numDashes: number;
  };
}

export type Theme = 'light' | 'dark' | 'system';

export interface ChromeMessage {
  action: string;
  [key: string]: any;
}
