// Create a context menu item for logging highlighted text and page data
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'checkForUnderstanding',
    title: 'Check for Understanding',
    contexts: ['selection'], // Only show this option when text is selected
  });
});

// Handle the context menu click event
// Sends a message to content script (llm.js) to generate a quiz
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'checkForUnderstanding' && info.selectionText) {
    // Log the selected text for testing purposes
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: logSelectedText,
      args: [info.selectionText],
    });

    // Generate a quiz question with 4 multiple choice answers
    // Call LLM API
    // Forward the request to content.js in the active tab
    chrome.tabs.sendMessage(tab.id, {
      type: 'generateQuiz',
      text: info.selectionText,
    });
  }
});

// Listen for messages from the content script after generating a quiz
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === 'quizResult') {
    // Log the quiz data
    console.log('Quiz data:', request.quizData);
    const result = await generateQuiz(request.quizData);

    if (result) {
      // Store the quiz data in local storage
      chrome.storage.local.set({ quizResult: result }, () => {
        console.log('Quiz result stored:', result);
      });

      // Optionally, you can notify the popup or content script that the data is ready
      chrome.runtime.sendMessage({ type: 'quizResult', quizData: result });
    }
  }
});

function logSelectedText(selectedText) {
  console.log('Selected text:', selectedText);
}
