// 1. Function that recieves the selected text, for now hardcoded
// Todo with Huzaifa, find best way to have an event listener for selected text
// which sends data to this function to parse and send to the LLM API

let PROMPT_CONTEXT = 'Generate a multiple choice quiz with 4 possibilities: ';
let MOCK_HIGHLIGHTED_TEXT = 'An RNN is a ML model';

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('calling generateQuiz');
  if (request.type === 'generateQuiz') {
    const result = await generateQuiz(request.text);

    // Send the result back to the background script
    chrome.runtime.sendMessage({ type: 'quizResult', quizData: result });
  }
  console.log('done calling generateQuiz');
});

// 2. Function that sends the text to the LLM API & generates 1 quiz question with 4 multiple choice answers
// and returns the response
async function generateQuiz(text) {
  console.log('Generating quiz...');
  if (!window.ai) {
    console.log('AI is not available');
    return;
  }

  const { available, defaultTemperature, defaultTopK, maxTopK } =
    await window.ai.languageModel.capabilities();

  if (available !== 'no') {
    const session = await window.ai.languageModel.create();
    console.log('Created a new session');
    console.log('Prompting the model...');

    const result = await session.prompt(PROMPT_CONTEXT + text);

    console.log('Result:', result);
    return result;
  }
  console.log('Unable to generate quiz: LLM is not available');
  return '';
}

// generateQuiz(MOCK_HIGHLIGHTED_TEXT); for testing purposes
