// Enhanced service worker with tab monitoring, blacklist checks, and API integrations

// Configuration
const CONFIG = {
  updateInterval: 3600000, // 1 hour in milliseconds
  rateLimitWindow: 60000, // 1 minute in milliseconds
  maxRequestsPerWindow: 20, // Maximum API requests per window
  cacheExpiry: 86400000, // 24 hours in milliseconds
  apiKeys: {
    googleSafeBrowsing: "YOUR_API_KEY" // Replace with your actual key in production
  }
};

// State management
let phishingBlacklist = [];
let lastBlacklistUpdate = 0;
let requestCounters = {};
let scanCache = {};

// Function to check if a URL is in the blacklist
const isUrlInBlacklist = (url) => {
  if (!url) return false;
  
  return phishingBlacklist.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(url);
    }
    return url.includes(pattern);
  });
};

// Function to enforce rate limiting
const isRateLimited = (clientId) => {
  const now = Date.now();
  
  if (!requestCounters[clientId]) {
    requestCounters[clientId] = {
      count: 0,
      resetTime: now + CONFIG.rateLimitWindow
    };
  }
  
  // Reset counter if window has expired
  if (now > requestCounters[clientId].resetTime) {
    requestCounters[clientId] = {
      count: 0,
      resetTime: now + CONFIG.rateLimitWindow
    };
  }
  
  // Check if rate limit exceeded
  if (requestCounters[clientId].count >= CONFIG.maxRequestsPerWindow) {
    return true;
  }
  
  // Increment counter
  requestCounters[clientId].count++;
  return false;
};

// Function to check URL against Google Safe Browsing API
const checkUrlWithGoogleSafeBrowsing = async (url) => {
  try {
    const apiKey = CONFIG.apiKeys.googleSafeBrowsing;
    const response = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client: {
          clientId: 'webwatchphish',
          clientVersion: '1.1.0'
        },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }]
        }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        isMalicious: data.matches && data.matches.length > 0,
        details: data.matches || []
      };
    }
    
    return { isMalicious: false, error: 'API request failed' };
  } catch (error) {
    console.error('Google Safe Browsing API error:', error);
    return { isMalicious: false, error: error.message };
  }
};

// Function to check URL against OpenPhish API
const checkUrlWithOpenPhish = async (url) => {
  try {
    // This is a simplified implementation that would need to be replaced with actual API call
    // OpenPhish doesn't have a simple API for individual URL checking - this is just a placeholder
    const inBlacklist = isUrlInBlacklist(url);
    
    return {
      isMalicious: inBlacklist,
      details: inBlacklist ? { reason: 'URL found in phishing database' } : null
    };
  } catch (error) {
    console.error('OpenPhish API error:', error);
    return { isMalicious: false, error: error.message };
  }
};

// Function to analyze URL locally
const analyzeUrlLocally = (url) => {
  // Count suspicious patterns
  const hasIpAddress = /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url);
  const hasSuspiciousSubdomain = /^https?:\/\/[^\/]+\.[^\/]+\.[^\/]+\.[^\/]+\.[^\/]+/.test(url);
  const hasSuspiciousKeywords = /(secure|banking|login|signin|verify|account|password|update|confirm)/i.test(url);
  const hasManySpecialChars = (url.match(/[^a-zA-Z0-9./-]/g) || []).length > 5;
  const isExcessivelyLong = url.length > 100;
  
  // Calculate threat score (0-1)
  let score = 0;
  if (hasIpAddress) score += 0.4;
  if (hasSuspiciousSubdomain) score += 0.2;
  if (hasSuspiciousKeywords) score += 0.25;
  if (hasManySpecialChars) score += 0.15;
  if (isExcessivelyLong) score += 0.1;
  
  // Determine threat level
  let threatLevel = "safe";
  if (score > 0.7) threatLevel = "high";
  else if (score > 0.4) threatLevel = "medium";
  else if (score > 0.2) threatLevel = "low";
  
  return {
    score: Math.min(1, score),
    threatLevel,
    features: {
      hasIpAddress,
      hasSuspiciousSubdomain,
      hasSuspiciousKeywords,
      hasManySpecialChars,
      isExcessivelyLong
    }
  };
};

// Comprehensive URL check using multiple methods
const checkUrl = async (url, clientId = 'default') => {
  // Check cache first
  if (scanCache[url] && scanCache[url].timestamp > Date.now() - CONFIG.cacheExpiry) {
    console.log('Using cached result for', url);
    return scanCache[url].result;
  }
  
  // Apply rate limiting
  if (isRateLimited(clientId)) {
    return {
      url,
      isSafe: false,
      threatLevel: "unknown",
      score: 0.5,
      message: "Rate limit exceeded. Please try again later."
    };
  }
  
  // Start timing the scan
  const scanStart = performance.now();
  
  // Perform local analysis
  const localAnalysis = analyzeUrlLocally(url);
  
  // Check blacklist
  const inBlacklist = isUrlInBlacklist(url);
  
  // If high risk locally or in blacklist, don't bother with API
  if (localAnalysis.threatLevel === "high" || inBlacklist) {
    const result = {
      url,
      isSafe: false,
      score: localAnalysis.score,
      threatLevel: "high",
      confidenceScore: 0.9,
      timestamp: new Date(),
      inBlacklist,
      scanSpeed: performance.now() - scanStart,
      features: localAnalysis.features,
      apiSource: "local"
    };
    
    // Cache result
    scanCache[url] = {
      timestamp: Date.now(),
      result
    };
    
    return result;
  }
  
  // Check with Google Safe Browsing
  const googleResult = await checkUrlWithGoogleSafeBrowsing(url);
  
  // Check with OpenPhish if Google finds nothing
  let openPhishResult = { isMalicious: false };
  if (!googleResult.isMalicious) {
    openPhishResult = await checkUrlWithOpenPhish(url);
  }
  
  // Combine results
  const isMalicious = googleResult.isMalicious || openPhishResult.isMalicious;
  
  // Determine final threat level
  let finalThreatLevel = localAnalysis.threatLevel;
  if (isMalicious) {
    finalThreatLevel = "high";
  } else if (localAnalysis.threatLevel === "medium") {
    finalThreatLevel = "medium";
  } else if (localAnalysis.threatLevel === "low") {
    finalThreatLevel = googleResult.error || openPhishResult.error ? "low" : "safe";
  }
  
  // Create final result
  const result = {
    url,
    isSafe: finalThreatLevel === "safe",
    score: isMalicious ? 0.9 : localAnalysis.score,
    threatLevel: finalThreatLevel,
    confidenceScore: isMalicious ? 0.95 : 0.7,
    timestamp: new Date(),
    inBlacklist,
    scanSpeed: performance.now() - scanStart,
    features: localAnalysis.features,
    apiSource: googleResult.isMalicious ? "googleSafeBrowsing" : 
               openPhishResult.isMalicious ? "openPhish" : "local"
  };
  
  // Cache result
  scanCache[url] = {
    timestamp: Date.now(),
    result
  };
  
  return result;
};

// Function to update the blacklist
const updateBlacklist = async () => {
  const now = Date.now();
  if (now - lastBlacklistUpdate < CONFIG.updateInterval) {
    return; // Only update once per hour
  }
  
  try {
    // In a real extension, you would fetch from an actual API or feed
    // This is a simplified example
    const fetchBlacklist = async () => {
      try {
        // This is a placeholder - in production, use a real phishing feed
        return [
          /phish/i,
          /banking.*login/i,
          'suspicious-site.com',
          'fake-login.com',
          'verify-account-secure.com',
          'paypal-secure-login.com',
          'facebook-verify.com',
          'apple-id-confirm.com',
          'microsoft-365-login.com',
          'amazon-order-verify.com'
        ];
      } catch (error) {
        console.error('Error fetching blacklist:', error);
        return [];
      }
    };
    
    const newBlacklist = await fetchBlacklist();
    
    if (newBlacklist && newBlacklist.length > 0) {
      phishingBlacklist = newBlacklist;
      lastBlacklistUpdate = now;
      console.log('Blacklist updated with', phishingBlacklist.length, 'entries');
    }
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
    notificationsEnabled: true,
    scanFrequency: "always",
    apiPreference: "both",
    scanHistory: [],
    lastScan: null
  });
  
  // Create context menu for quick scanning
  chrome.contextMenus.create({
    id: "scanLink",
    title: "Scan for phishing",
    contexts: ["link"]
  });
  
  // Update blacklist on installation
  await updateBlacklist();
});

// Listen for tab updates to scan URLs automatically
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Check if the tab has completed loading and has a URL
  if (changeInfo.status === 'complete' && tab.url) {
    // Get user settings
    const { autoScanEnabled, notificationsEnabled, scanFrequency } = 
      await chrome.storage.local.get(['autoScanEnabled', 'notificationsEnabled', 'scanFrequency']);
    
    if (autoScanEnabled) {
      // Skip scanning internal browser pages and extensions
      if (tab.url.startsWith('chrome:') || tab.url.startsWith('chrome-extension:') || 
          tab.url.startsWith('about:') || tab.url.startsWith('moz-extension:')) {
        return;
      }
      
      // Perform scan
      const result = await checkUrl(tab.url, `tab_${tabId}`);
      
      // Set badge based on threat level
      if (result.threatLevel === "high") {
        chrome.action.setBadgeText({ tabId, text: '!' });
        chrome.action.setBadgeBackgroundColor({ tabId, color: '#f44336' });
        
        if (notificationsEnabled) {
          // Show notification for high threats
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Phishing Alert!',
            message: 'The site you are visiting may be a phishing attempt.',
            priority: 2
          });
        }
      } else if (result.threatLevel === "medium") {
        chrome.action.setBadgeText({ tabId, text: '?' });
        chrome.action.setBadgeBackgroundColor({ tabId, color: '#ff9800' });
      } else {
        chrome.action.setBadgeText({ tabId, text: '' });
      }
      
      // Store the scan in history
      const { scanHistory } = await chrome.storage.local.get('scanHistory');
      const updatedHistory = [result, ...(scanHistory || [])].slice(0, 50); // Keep last 50 entries
      
      chrome.storage.local.set({ 
        scanHistory: updatedHistory,
        lastScan: result
      });
    }
  }
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scanLink" && info.linkUrl) {
    // Scan the link that was right-clicked
    checkUrl(info.linkUrl).then(result => {
      // Show notification with result
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: result.isSafe ? 'Link appears safe' : 'Potential phishing link!',
        message: `Threat level: ${result.threatLevel}`,
        priority: result.isSafe ? 0 : 2
      });
      
      // Update history
      chrome.storage.local.get('scanHistory', (data) => {
        const scanHistory = data.scanHistory || [];
        chrome.storage.local.set({ 
          scanHistory: [result, ...scanHistory].slice(0, 50),
          lastScan: result
        });
      });
    });
  }
});

// Listen for messages from the extension popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'checkCurrentUrl') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentUrl = tabs[0]?.url || '';
      const result = await checkUrl(currentUrl);
      sendResponse(result);
    });
    // Return true to indicate we will send a response asynchronously
    return true;
  }
  
  if (message.action === 'scanUrl') {
    checkUrl(message.url).then(result => {
      sendResponse(result);
    });
    return true;
  }
  
  if (message.action === 'toggleAutoScan') {
    chrome.storage.local.set({ autoScanEnabled: message.enabled });
    sendResponse({ success: true });
    return true;
  }
  
  if (message.action === 'reportPhishing') {
    // Store the report
    chrome.storage.local.get('userReports', (data) => {
      const reports = data.userReports || [];
      const newReport = {
        url: message.url,
        reportType: message.reportType,
        comment: message.comment,
        timestamp: new Date().toISOString()
      };
      
      chrome.storage.local.set({ 
        userReports: [newReport, ...reports]
      });
      
      // Add to local blacklist temporarily
      phishingBlacklist.push(message.url);
      
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (message.action === 'getSettings') {
    chrome.storage.local.get([
      'autoScanEnabled', 
      'darkModeEnabled', 
      'notificationsEnabled',
      'scanFrequency',
      'apiPreference',
      'privacyMode'
    ], (result) => {
      sendResponse(result);
    });
    return true;
  }
  
  if (message.action === 'updateSettings') {
    chrome.storage.local.set(message.settings, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (message.action === 'clearScanHistory') {
    chrome.storage.local.set({ scanHistory: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Keep blacklist updated periodically
setInterval(updateBlacklist, CONFIG.updateInterval);

// Background task to clear expired cache entries
setInterval(() => {
  const now = Date.now();
  Object.keys(scanCache).forEach(url => {
    if (scanCache[url].timestamp < now - CONFIG.cacheExpiry) {
      delete scanCache[url];
    }
  });
  console.log('Cache cleaned, remaining entries:', Object.keys(scanCache).length);
}, CONFIG.updateInterval);

// Listen for command shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'check_current_url') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.url) {
        const result = await checkUrl(tabs[0].url);
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: result.isSafe ? 'URL appears safe' : 'Potential phishing threat!',
          message: `Threat level: ${result.threatLevel}`,
          priority: result.isSafe ? 0 : 2
        });
      }
    });
  }
});
