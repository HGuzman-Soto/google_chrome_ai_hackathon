// content.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'logData') {
    console.log('Logging data from content script:', request.text);
  }
});
