
import { ChromeMessage } from "@/types";

// Check if we're running as a Chrome extension
export const isExtension = (): boolean => {
  return window.chrome && chrome.runtime && chrome.runtime.id ? true : false;
};

// Send a message to the Chrome extension background script
export const sendChromeMessage = async (message: ChromeMessage): Promise<any> => {
  if (!isExtension()) {
    console.warn('Not running as a Chrome extension');
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
    return null;
  }

  const response = await sendChromeMessage({ action: 'checkCurrentUrl' });
  return response?.url || null;
};
