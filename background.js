let currentDomain = '';
let inactivityTimeout;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ profilePassword: 'Admin' });
  chrome.storage.local.set({ isLocked: true });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'unlockProfile') {
    chrome.storage.local.set({ isLocked: false });
    resetInactivityTimeout();
    sendResponse({ status: 'unlocked' });
  } else if (request.action === 'checkLockStatus') {
    chrome.storage.local.get('isLocked', function(data) {
      sendResponse({ isLocked: data.isLocked });
    });
    return true;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const newDomain = new URL(tab.url).hostname;
    if (newDomain !== currentDomain) {
      currentDomain = newDomain;
      chrome.storage.local.get('isLocked', function(data) {
        if (data.isLocked) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          });
        }
      });
    }
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url) {
      const newDomain = new URL(tab.url).hostname;
      if (newDomain !== currentDomain) {
        currentDomain = newDomain;
        chrome.storage.local.get('isLocked', function(data) {
          if (data.isLocked) {
            chrome.scripting.executeScript({
              target: { tabId: activeInfo.tabId },
              files: ['content.js']
            });
          }
        });
      }
    }
  });
});

function resetInactivityTimeout() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    chrome.storage.local.set({ isLocked: true });
  }, 300000);
}

chrome.tabs.onHighlighted.addListener(resetInactivityTimeout);
chrome.windows.onFocusChanged.addListener(resetInactivityTimeout);
