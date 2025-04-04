
import { ChromeMessage, ExtensionSettings } from "@/types";

// Declare chrome namespace to fix TypeScript errors
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        id?: string;
        sendMessage?: (message: any, callback: (response: any) => void) => void;
      };
      storage?: {
        local?: {
          get?: (keys: string[] | null, callback: (result: any) => void) => void;
          set?: (items: any, callback?: () => void) => void;
        };
      };
      tabs?: {
        query?: (queryInfo: any, callback: (tabs: any[]) => void) => void;
      };
    };
  }
}

// Check if we're running as a Chrome extension
export const isExtension = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.chrome !== 'undefined' && 
         typeof window.chrome.runtime !== 'undefined' && 
         typeof window.chrome.runtime.id !== 'undefined';
};

// Send a message to the Chrome extension background script
export const sendChromeMessage = async (message: ChromeMessage): Promise<any> => {
  if (!isExtension()) {
    console.warn('Not running as a Chrome extension');
    
    // For web-only mode, provide mock responses for common actions
    if (message.action === 'getSettings') {
      return {
        autoScanEnabled: localStorage.getItem('autoScanEnabled') !== 'false',
        darkModeEnabled: localStorage.getItem('darkModeEnabled') !== 'false'
      };
    }
    
    if (message.action === 'toggleAutoScan') {
      localStorage.setItem('autoScanEnabled', message.enabled ? 'true' : 'false');
      return { success: true };
    }
    
    if (message.action === 'reportPhishing') {
      console.log('Web mode: URL reported as phishing:', message.url);
      // In web mode, just log the report
      return { success: true };
    }
    
    return null;
  }

  return new Promise((resolve) => {
    if (window.chrome?.runtime?.sendMessage) {
      window.chrome.runtime.sendMessage(message, (response) => {
        resolve(response);
      });
    } else {
      resolve(null);
    }
  });
};

// Get the URL of the active tab
export const getCurrentTabUrl = async (): Promise<string | null> => {
  if (!isExtension()) {
    console.warn('Not running as a Chrome extension');
    // In web mode, return the current URL as a fallback
    return window.location.href;
  }

  const response = await sendChromeMessage({ action: 'checkCurrentUrl' });
  return response?.url || null;
};

// Save settings to local storage or extension storage
export const saveSettings = async (settings: Partial<ExtensionSettings>): Promise<boolean> => {
  try {
    if (isExtension()) {
      // Save to chrome.storage.local
      return new Promise((resolve) => {
        if (window.chrome?.storage?.local?.set) {
          window.chrome.storage.local.set(settings, () => {
            resolve(true);
          });
        } else {
          resolve(false);
        }
      });
    } else {
      // Save to localStorage for web mode
      Object.entries(settings).forEach(([key, value]) => {
        localStorage.setItem(key, String(value));
      });
      return true;
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

// Get settings from storage
export const getSettings = async (): Promise<Partial<ExtensionSettings>> => {
  try {
    if (isExtension()) {
      return new Promise((resolve) => {
        if (window.chrome?.storage?.local?.get) {
          window.chrome.storage.local.get(['autoScanEnabled', 'darkModeEnabled'], (result) => {
            resolve({
              autoScanEnabled: result.autoScanEnabled ?? true,
              darkModeEnabled: result.darkModeEnabled ?? true
            });
          });
        } else {
          resolve({
            autoScanEnabled: true,
            darkModeEnabled: true
          });
        }
      });
    } else {
      // Get from localStorage for web mode
      return {
        autoScanEnabled: localStorage.getItem('autoScanEnabled') !== 'false',
        darkModeEnabled: localStorage.getItem('darkModeEnabled') !== 'false'
      };
    }
  } catch (error) {
    console.error('Error getting settings:', error);
    return {
      autoScanEnabled: true,
      darkModeEnabled: true
    };
  }
};

// Get the current active tab info
export const getActiveTabInfo = async (): Promise<{ url: string; title: string; favIconUrl: string } | null> => {
  if (!isExtension()) {
    return {
      url: window.location.href,
      title: document.title,
      favIconUrl: ''
    };
  }
  
  try {
    if (!window.chrome?.tabs?.query) {
      return null;
    }
    
    const tabs = await new Promise<any[]>((resolve) => {
      window.chrome!.tabs!.query!({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs);
      });
    });
    
    if (tabs && tabs.length > 0) {
      const tab = tabs[0];
      return {
        url: tab.url || '',
        title: tab.title || '',
        favIconUrl: tab.favIconUrl || ''
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting active tab:', error);
    return null;
  }
};
