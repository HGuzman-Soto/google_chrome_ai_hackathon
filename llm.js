// 1. Function that recieves the selected text, for now hardcoded
// Todo with Huzaifa, find best way to have an event listener for selected text
// which sends data to this function to parse and send to the LLM API

let PROMPT_CONTEXT = `
Instructions: Create a multiple-choice quiz based on the provided text. Each question should have four answer options, and only one option should be correct. Provide the following structure:

- **Instructions**: A brief description of the quiz, such as "Answer the following questions based on the text."
- **Questions**: List each question without numbering, with four answer options labeled A, B, C, and D.
- **Answer Key**: List only the correct option letters (e.g., A, B, C, D) for each question, in order. The answer key should be at the end of the text.

For example:
**Instructions:** Answer the following questions based on the text.
**Questions:**
1. Which of the following is the correct order of layers?
  A) Input, Output, Hidden
  B) Hidden, Input, Output
  C) Output, Input, Hidden
  D) Hidden, Output, Input

2. What is the activation function used in neural networks?
  A) ReLU
  B) Sigmoid
  C) Tanh
  D) Linear

**Answer Key:**
1. B
2. A
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
    console.error('AI is not available');
    return;
  }

  try {
    const { available, defaultTemperature, defaultTopK, maxTopK } =
      await window.ai.languageModel.capabilities();

    if (available !== 'no') {
      const session = await window.ai.languageModel.create();
      console.log('Created a new session');
      console.log('Prompting the model...');

      try {
        const result = await session.prompt(PROMPT_CONTEXT + text);
        console.log('Result:', result);
        return result;
      } catch (promptError) {
        console.error('Error during model prompt:', promptError);
        return '';
      }
    } else {
      console.log('Unable to generate quiz: LLM is not available');
      return '';
    }
  } catch (capabilitiesError) {
    console.error('Error retrieving model capabilities:', capabilitiesError);
    return '';
  }
}

// generateQuiz(MOCK_HIGHLIGHTED_TEXT); for testing purposes
