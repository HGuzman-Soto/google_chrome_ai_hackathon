// 1. Function that recieves the selected text, for now hardcoded
// Todo with Huzaifa, find best way to have an event listener for selected text
// which sends data to this function to parse and send to the LLM API

let PROMPT_CONTEXT = 'Generate a multiple choice quiz with 4 possibilities: ';
let MOCK_HIGHLIGHTED_TEXT = 'An RNN is a ML model';

// 2. Function that sends the text to the LLM API & generates 1 quiz question with 4 multiple choice answers
// and returns the response
async function generateQuiz(text) {
  if (!window.ai) {
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
  }
}

generateQuiz(MOCK_HIGHLIGHTED_TEXT);
