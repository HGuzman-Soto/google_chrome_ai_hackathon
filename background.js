// background.js

// Create a context menu item for logging highlighted text and page data
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'checkForUnderstanding',
    title: 'Check for Understanding',
    contexts: ['selection'], // Only show this option when text is selected
  });
  chrome.contextMenus.create({
    id: 'logHighlightedTextAndPageData',
    title: 'Log Highlighted Text and Page Data',
    contexts: ['selection'], // Only show this menu when text is selected
  });
});

// Handle the context menu click event
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'checkForUnderstanding' && info.selectionText) {
    // Send the selected text to the content script in the active tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: logSelectedText,
      args: [info.selectionText],
    });
  }
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'logHighlightedTextAndPageData' && info.selectionText) {
    // Send a message to the content script to collect page data
    chrome.tabs.sendMessage(tab.id, { 
      type: 'collectData', 
      highlightedText: info.selectionText // Send the highlighted text with the message
    }, (response) => {
      // Combine highlighted text with page data
      const dataToSend = {
        highlightedText: info.selectionText,
        pageData: response.data
      };

      // Log the combined data (or send to an API in the future)
      console.log('Data to send:', dataToSend);
    });
  }
});
