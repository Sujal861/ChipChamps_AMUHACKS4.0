
// This is a basic Chrome extension service worker
// It can be expanded to add background functionality

chrome.runtime.onInstalled.addListener(() => {
  console.log('Web Watch Phish extension installed!');
});

// Listen for messages from the extension popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'checkCurrentUrl') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0]?.url || '';
      sendResponse({ url: currentUrl });
    });
    // Return true to indicate we will send a response asynchronously
    return true;
  }
});
