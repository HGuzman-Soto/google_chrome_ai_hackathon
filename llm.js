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

let session;
let sessionTimeout;

async function getOrCreateSession() {
  if (session) {
    console.log('Reusing existing session');
    resetSessionTimeout(); // Reset the timeout whenever the session is reused
    return session;
  }

  console.log('Creating a new session');
  session = await window.ai.languageModel.create({
    systemPrompt: PROMPT_CONTEXT,
  });

  return session;
}

// / Reset the session timeout to destroy the session after inactivity
function resetSessionTimeout() {
  // Clear any existing timeout
  if (sessionTimeout) clearTimeout(sessionTimeout);

  // Set a timeout to destroy the session after 5 minutes of inactivity
  sessionTimeout = setTimeout(() => {
    if (session) {
      console.log(
        'Session inactive for 5 minutes. Destroying session to free resources.'
      );
      session.destroy();
      session = null; // Clear the session reference
    }
  }, 5 * 60 * 1000); // 5 minutes in milliseconds
}

// Exception handler function
function handleException(error, context) {
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'InvalidStateError':
        console.error(`${context}: Invalid state error - ${error.message}`);
        if (context.includes('Session')) {
          console.log('Attempting to create a new session...');
          session = null;
        }
        break;

      case 'OperationError':
        console.error(
          `${context}: Model execution service is not available - ${error.message}`
        );
        console.log('Relaunch Chrome and try again.');
        break;

      case 'UnknownError':
        console.error(`${context}: Unknown error - ${error.message}`);
        console.log(
          'Retrying may resolve the issue. Report a technical issue if it persists.'
        );
        break;

      case 'NotSupportedError':
        console.error(`${context}: Unsupported operation - ${error.message}`);
        break;

      case 'NotReadableError':
        console.error(`${context}: Response is disabled - ${error.message}`);
        break;

      case 'AbortError':
        console.error(`${context}: Request was canceled - ${error.message}`);
        break;

      default:
        console.error(`${context}: Unexpected DOMException - ${error.message}`);
    }
  } else {
    console.error(
      `${context}: Non-DOMException encountered - ${error.message}`
    );
  }
}

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
    const { available } = await window.ai.languageModel.capabilities();
    if (available !== 'no') {
      let session = await getOrCreateSession();

      // Check tokens left before sending the prompt
      if (session.tokensLeft < 1024) {
        console.log(
          `Tokens low: ${session.tokensLeft} left. Creating a new session.`
        );
        session.destroy(); // Destroy the current session
        session = await getOrCreateSession(); // Create a new session if tokens are low
      } else {
        console.log(
          `${session.tokensSoFar}/${session.maxTokens} (${session.tokensLeft} tokens left)`
        );
      }

      try {
        const result = await session.prompt(PROMPT_CONTEXT + text);
        console.log('Result:', result);
        return result;
      } catch (promptError) {
        handleException(promptError, 'Error during model prompt');
        session = null;
        const newSession = await getOrCreateSession();
        return newSession ? await newSession.prompt(PROMPT_CONTEXT + text) : '';
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
