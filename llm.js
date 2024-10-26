// 1. Function that recieves the selected text, for now hardcoded
// Todo with Huzaifa, find best way to have an event listener for selected text
// which sends data to this function to parse and send to the LLM API

let PROMPT_CONTEXT = `
Instructions: Create a multiple-choice quiz based on the provided text. Each question should have four answer options, and only one option should be correct. Provide the following structure:

Instructions: A brief description of the quiz (e.g., "Answer the following questions based on the text.")
Questions: A list of questions, each with four answer options (labeled A, B, C, and D).
Answer Key: A list of correct answers for each question using only the option letter (e.g., 1. A, 2. C).
`;

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
