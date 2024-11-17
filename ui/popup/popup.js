import { handleQuizSubmission } from '../quiz/handle_submission.js';
const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submit');

function buildQuiz(quizData) {
  const output = [];

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

// Load quiz data and initialize the quiz
chrome.storage.local.get(['quizResult'], (result) => {
  if (result.quizResult) {
    buildQuiz(result.quizResult); // Populate the quiz with stored data
  } else {
    quizContainer.innerHTML = '<p>No quiz data available.</p>';
  }
});

// Add event listener to submit button
submitButton.addEventListener('click', () => {
  chrome.storage.local.get(['quizResult'], (result) => {
    if (result.quizResult) {
      handleQuizSubmission(result.quizResult); // Handle the quiz submission
    }
  });
});
