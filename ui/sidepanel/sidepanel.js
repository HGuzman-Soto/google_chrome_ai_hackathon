const quizContainer = document.getElementById('quiz');
const generateQuizSubmitButton = document.getElementById('generate_quiz');
let selectedText = '';

function buildQuiz(quizData) {
  const output = [];
  console.log('log in popup.js', quizData);

  quizData.questions.forEach((currentQuestion, questionNumber) => {
    const options = [];

    // Generate each option for the question
    Object.entries(currentQuestion.options).forEach(([key, option]) => {
      options.push(
        `<li>
          <label>
            <input type="radio" name="question${questionNumber}" value="${key}">
            ${key}) ${option}
          </label>
        </li>`
      );
    });

    output.push(
      `<div class="question">
        <p>${questionNumber + 1}. ${currentQuestion.question}</p>
        <ul class="options">
          ${options.join('')}
        </ul>
      </div>`
    );
  });

  quizContainer.innerHTML = output.join('');
}

function showResults(quizData) {
  quizData.questions.forEach((currentQuestion, questionNumber) => {
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = document.querySelector(selector);
    const correctAnswer = quizData.answerKey[questionNumber];
    const options = document.querySelectorAll(
      `input[name=question${questionNumber}]`
    );

    // Highlight each option based on correctness
    options.forEach((option) => {
      if (option.value === correctAnswer) {
        // Correct answer highlighted in green
        option.parentElement.style.color = 'green';
      } else if (
        userAnswer &&
        option === userAnswer &&
        userAnswer.value !== correctAnswer
      ) {
        // Incorrect answer highlighted in red
        option.parentElement.style.color = 'red';
      }
    });
  });

  alert(
    `Quiz completed! Check the highlights for correct and incorrect answers.`
  );
}

// Function to display highlighted/selected text
function displaySelectedText(text) {
  const quizContainer = document.getElementById('quiz');
  if (quizContainer) {
    // cache selected text in-memory
    selectedText = text;

    // Truncate text if it's longer than 600 characters
    const truncatedText =
      text.length > 600 ? text.substring(0, 600) + '...' : text;

    quizContainer.innerHTML = `
      <div class="highlighted-text">
        <h3>Selected Text:</h3>
        <div class="text-content">${truncatedText}</div>
        <div class="text-stats">Characters: ${text.length}</div>
      </div>
    `;
  }
}

// Modify your message listener to handle the highlighted text
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('Received message in popup.js:', request);
  if (request.type === 'displaySelectedText') {
    displaySelectedText(request.text);
  } else if (request.type === 'quizUpdated') {
    // Your existing quiz display logic
    chrome.storage.local.get(['quizResult'], (result) => {
      const quizData = result.quizResult;
      if (quizData) {
        buildQuiz(quizData);
      }
    });
  }
});

generateQuizSubmitButton.addEventListener('click', () => {
  console.log('Generate Quiz button clicked');
  // Send a message to the background script
  chrome.runtime.sendMessage({
    type: 'generateSummary',
    text: selectedText, // pass selected text from in-memory
  });
});
