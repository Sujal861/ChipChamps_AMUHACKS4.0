
import { ChromeMessage, ExtensionSettings } from "@/types";

// Check if we're running as a Chrome extension
export const isExtension = (): boolean => {
  return window.chrome && chrome.runtime && chrome.runtime.id ? true : false;
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
    chrome.runtime.sendMessage(message, (response) => {
      resolve(response);
    });
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
        chrome.storage.local.set(settings, () => {
          resolve(true);
        });
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
        chrome.storage.local.get(['autoScanEnabled', 'darkModeEnabled'], (result) => {
          resolve({
            autoScanEnabled: result.autoScanEnabled ?? true,
            darkModeEnabled: result.darkModeEnabled ?? true
          });
        });
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
    const tabs = await new Promise<chrome.tabs.Tab[]>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
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
