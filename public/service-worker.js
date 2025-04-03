
// Enhanced service worker with tab monitoring and blacklist checks

// Initialize variables for blacklist
let phishingBlacklist = [];
let lastBlacklistUpdate = 0;
const BLACKLIST_UPDATE_INTERVAL = 3600000; // 1 hour in milliseconds

// Function to check if a URL is in the blacklist
const isUrlInBlacklist = (url) => {
  return phishingBlacklist.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(url);
    }
    return url.includes(pattern);
  });
};

// Function to update the blacklist (simulated)
const updateBlacklist = async () => {
  const now = Date.now();
  if (now - lastBlacklistUpdate < BLACKLIST_UPDATE_INTERVAL) {
    return; // Only update once per hour
  }
  
  try {
    // In a real extension, you would fetch from Google Safe Browsing API or similar service
    // This is a simplified example using mock data
    const response = await fetch('https://safebrowsing.googleapis.com/v4/threatMatches:find?key=YOUR_API_KEY', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client: {
          clientId: 'webwatchphish',
          clientVersion: '1.0.0'
        },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url: 'example.com' }]
        }
      })
    }).catch(() => {
      // If API call fails, use static blacklist for demo purposes
      return {
        ok: false
      };
    });

    if (response.ok) {
      const data = await response.json();
      // Process API response to update blacklist
      // This would parse the API response format
    } else {
      // For demonstration, use a simple static list if API fails
      phishingBlacklist = [
        /phish/i,
        /banking.*login/i,
        'suspicious-site.com',
        'fake-login.com'
      ];
    }
    
    lastBlacklistUpdate = now;
    console.log('Blacklist updated with', phishingBlacklist.length, 'entries');
  } catch (error) {
    console.error('Error updating blacklist:', error);
  }
};

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Web Watch Phish extension installed!');
  
  // Initialize storage with default settings
  chrome.storage.local.set({
    autoScanEnabled: true,
    darkModeEnabled: true,
    scanHistory: [],
    lastScan: null
  });
  
  // Update blacklist on installation
  await updateBlacklist();
});

// Listen for tab updates to scan URLs automatically
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Check if the tab has completed loading and has a URL
  if (changeInfo.status === 'complete' && tab.url) {
    // Get user settings
    const { autoScanEnabled } = await chrome.storage.local.get('autoScanEnabled');
    
    if (autoScanEnabled) {
      // Perform quick blacklist check first
      const urlInBlacklist = isUrlInBlacklist(tab.url);
      
      if (urlInBlacklist) {
        // If URL is in blacklist, show a warning
        chrome.action.setBadgeText({ text: '⚠️' });
        chrome.action.setBadgeBackgroundColor({ color: '#f44336' });
        
        // Send notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'Phishing Alert!',
          message: 'The site you are visiting may be a phishing attempt.',
          priority: 2
        });
      } else {
        // If not in blacklist, reset badge
        chrome.action.setBadgeText({ text: '' });
      }
      
      // Store the scan in history
      const scanResult = {
        url: tab.url,
        timestamp: new Date().toISOString(),
        inBlacklist: urlInBlacklist,
        threatLevel: urlInBlacklist ? 'high' : 'low'
      };
      
      // Update storage with scan result
      const { scanHistory } = await chrome.storage.local.get('scanHistory');
      const updatedHistory = [scanResult, ...(scanHistory || [])].slice(0, 50); // Keep last 50 entries
      
      chrome.storage.local.set({ 
        scanHistory: updatedHistory,
        lastScan: scanResult
      });
    }
  }
});

// Listen for messages from the extension popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'checkCurrentUrl') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentUrl = tabs[0]?.url || '';
      const inBlacklist = isUrlInBlacklist(currentUrl);
      
      sendResponse({ 
        url: currentUrl,
        inBlacklist,
        threatLevel: inBlacklist ? 'high' : 'unknown' // Unknown means needs further analysis
      });
    });
    // Return true to indicate we will send a response asynchronously
    return true;
  }
  
  if (message.action === 'toggleAutoScan') {
    chrome.storage.local.set({ autoScanEnabled: message.enabled });
    sendResponse({ success: true });
    return true;
  }
  
  if (message.action === 'reportPhishing') {
    // In a real extension, this would submit to a backend
    console.log('Phishing URL reported:', message.url);
    
    // Add to local blacklist temporarily
    phishingBlacklist.push(message.url);
    
    sendResponse({ success: true });
    return true;
  }
  
  if (message.action === 'getSettings') {
    chrome.storage.local.get(['autoScanEnabled', 'darkModeEnabled'], (result) => {
      sendResponse(result);
    });
    return true;
  }
});

// Update blacklist periodically
setInterval(updateBlacklist, BLACKLIST_UPDATE_INTERVAL);
