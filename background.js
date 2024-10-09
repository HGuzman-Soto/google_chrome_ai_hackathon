// background.js

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'checkForUnderstanding',
    title: 'Check for Understanding',
    contexts: ['selection'], // Only show this option when text is selected
  });
});

// Handle context menu click
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

// A function that will log the selected text (invoked by executeScript)
function logSelectedText(selectedText) {
  console.log('Selected text:', selectedText);
}
