// Create a context menu item for logging highlighted text and page data
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'checkForUnderstanding',
    title: 'Check for Understanding',
    contexts: ['selection', 'all'], // Only show this option when text is selected
  });
});

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  await chrome.sidePanel.setOptions({
    tabId,
    path: 'ui/sidepanel/sidepanel.html',
    enabled: true,
  });

  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});

// Handle the context menu click event
// Sends a message to content script (llm.js) to generate a quiz
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'checkForUnderstanding' && info.selectionText) {
    // Open the side panel when checking for understanding
    // This will open the panel in all the pages on the current window.
    chrome.sidePanel.open({ windowId: tab.windowId });

    // Log the selected text for testing purposes
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: logSelectedText,
      args: [info.selectionText],
    });

    chrome.runtime.sendMessage({
      type: 'displaySelectedText',
      text: info.selectionText,
    });

    /// Take the selected text and send it to the Summarizer API to generate a summary of the text
    // Step 1: Send text to generate a summary
    chrome.tabs.sendMessage(tab.id, {
      type: 'generateSummary',
      text: info.selectionText,
    });

    // // Generate a quiz question with 4 multiple choice answers
    // // Call LLM API
    // // Forward the request to content.js in the active tab
    // chrome.tabs.sendMessage(tab.id, {
    //   type: 'generateQuiz',
    //   text: info.selectionText,
    // });
  }
});

// Listen for messages from the content script after generating a quiz
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('Received message:', request);

  if (request.type === 'summaryResult') {
    // Step 2: Summary received, now generate the quiz
    console.log('Summary data received:', request.summaryData);
    chrome.tabs.sendMessage(sender.tab.id, {
      type: 'generateQuiz',
      text: request.summaryData,
    });
  }

  if (request.type === 'quizResult') {
    // Step 3: Quiz result received, parse and store it
    // Log the quiz data
    console.log('Quiz data:', request.quizData);
    // const result = await generateQuiz(request.quizData);

    if (request.quizData) {
      // Parse the quiz data
      quiz_sections = parseQuizText(request.quizData);
      console.log('Quiz sections:', quiz_sections);

      // Store the quiz data in local storage
      chrome.storage.local.set({ quizResult: quiz_sections }, () => {
        console.log('Quiz result stored:', quiz_sections);
      });

      console.log('sending message to sidepanel.js to update ui');
      // // Send a message to the UI to update the quiz
      // chrome.tabs.sendMessage(sender.tab.id, {
      //   type: 'quizUpdated',
      // });

      // Temporarily sending to popup.js
      chrome.runtime.sendMessage({
        type: 'quizUpdated',
      });
      console.log('sent message to sidepanel.js to update ui');
    }
  }
});

function logSelectedText(selectedText) {
  console.log('Selected text:', selectedText);
}

function parseQuizText(quizText) {
  const sections = {
    instructions: '',
    questions: [],
    answerKey: [],
  };

  // Split the text into lines
  const lines = quizText.split('\n');

  let currentSection = '';

  lines.forEach((line) => {
    // Check for section headers to identify each part
    if (
      line.startsWith('**Instructions:**') ||
      line.startsWith('Instructions:')
    ) {
      currentSection = 'instructions';
      sections.instructions = line.replace('**Instructions:**', '').trim();
    } else if (
      line.startsWith('**Questions:**') ||
      line.startsWith('Questions:')
    ) {
      currentSection = 'questions';
    } else if (
      line.startsWith('**Answer Key:**') ||
      line.startsWith('Answer Key:')
    ) {
      currentSection = 'answerKey';
    } else if (currentSection === 'questions' && line.trim()) {
      // Parse questions and options
      const questionMatch = line.match(/^\d+\.\s(.+)/);
      const optionMatch = line.match(/^\s*(A|B|C|D)\)\s(.+)/);

      if (questionMatch) {
        // Add a new question with the parsed question text
        sections.questions.push({
          question: questionMatch[1].trim(),
          options: {},
        });
      } else if (optionMatch) {
        // Add options to the last question in the array
        const lastQuestion = sections.questions[sections.questions.length - 1];
        if (lastQuestion) {
          lastQuestion.options[optionMatch[1]] = optionMatch[2].trim();
        }
      }
    } else if (currentSection === 'answerKey' && line.trim()) {
      // Parse answer key items
      const answerMatch = line.match(/^\d+\.\s([A-D])/);
      if (answerMatch) {
        sections.answerKey.push(answerMatch[1]);
      }
    }
  });

  return sections;
}
