let session = null;

async function initDefaults() {
  console.log('Initializing defaults...');
  console.log('ai', window.ai);
  if (!window.ai) {
    return;
  }
  const defaults = await window.ai.assistant.capabilities();

  console.log('Model defaults:', defaults);
}

initDefaults();

const updateSession = async () => {
  session = await window.ai.assistant.create({
    temperature: 1,
    topK: 1,
  });
};

// 1. Function that recieves the selected text, for now hardcoded
// Todo with Huzaifa, find best way to have an event listener for selected text
// which sends data to this function to parse and send to the LLM API
let PROMPT_CONTEXT =
  'I want you to generate a quiz based on the following text I have while browsing and researching the web. Help me check for understanding. Text: ';
let highlightedText =
  "You have definitely come across software that translates natural language (Google Translate) or turns your speech into text (Apple Siri) and probably, at first, you were curious how it works. In the last couple of years, a considerable improvement in the science behind these systems has taken place. For example, in late 2016, Google introduced a new system behind their Google Translate which uses state-of-the-art machine learning techniques. The improvement is remarkable and you can test it yourself. Another astonishing example is Baidu’s most recent text to speech: So what do all the above have in common? They deal with sequential data to make predictions. Okay, but how that differs from the well-known cat image recognizers? Imagine you want to say if there is a cat in a photo. You can train a feedforward neural network (typically CNN-Convolutional Neural Network) using multiple photos with and without cats. In this network, the information moves in only one direction, forward, from the input nodes, through the hidden nodes (if any) and to the output nodes. There are no cycles or loops in the network. — Wikipedia';";

// 2. Function that sends the text to the LLM API & generates 1 quiz question with 4 multiple choice answers
// and returns the response
async function generateQuiz(text) {
  if (!window.ai) {
    return;
  }

  console.log('Generating quiz...');
  let fullResponse = '';
  text = text.trim();
  if (!text) return;

  try {
    if (!session) {
      console.log('Initializing session...');
      await updateSession();
    }
    const stream = await session.promptStreaming(PROMPT_CONTEXT + text);
    console.log('Stream:', stream);
    for await (const chunk of stream) {
      console.log('Chunk:', chunk);
      fullResponse = chunk.trim();
      //   p.innerHTML = DOMPurify.sanitize(marked.parse(fullResponse));
      //   rawResponse.innerText = fullResponse;
    }
  } catch (error) {
    console.error('Error:', error);
    // p.textContent = `Error: ${error.message}`;
  }
  console.log('Response:', fullResponse);
}

if (!session) {
  //   const { defaultTopK, maxTopK, defaultTemperature } =
  //     await window.ai.assistant.capabilities();
  //   sessionTemperature.value = defaultTemperature;
  //   sessionTopK.value = defaultTopK;
  //   sessionTopK.max = maxTopK;
  await updateSession();
}

generateQuiz(highlightedText);

// 3. Function that logs the response to the console
