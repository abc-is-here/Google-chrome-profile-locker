chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ profilePassword: 'abchack' });
  chrome.storage.local.set({ isLocked: true });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'unlockProfile') {
    chrome.storage.local.set({ isLocked: false });
    sendResponse({ status: 'unlocked' });
  } else if (request.action === 'checkLockStatus') {
    chrome.storage.local.get('isLocked', function(data) {
      sendResponse({ isLocked: data.isLocked });
    });
    return true;
  }
});
