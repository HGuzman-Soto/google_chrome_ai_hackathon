const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submit');
const scoreSummary = document.getElementById('scoreSummary');
const scoreText = document.getElementById('scoreText');
const reviewAnswersButton = document.getElementById('reviewAnswers');

function buildQuiz(quizData) {
  const output = [];
  quizData.questions.forEach((currentQuestion, questionNumber) => {
    const options = Object.entries(currentQuestion.options).map(
      ([key, option]) => `
        <li>
          <label>
            <input type="radio" name="question${questionNumber}" value="${key}">
            ${option}
          </label>
        </li>`
    );
    output.push(`
      <div class="question">
        <p>${currentQuestion.question}</p>
        <ul class="options">${options.join('')}</ul>
      </div>`
    );
  });
  quizContainer.innerHTML = output.join('');
}

// Function to calculate and display score
function calculateScore(quizData) {
  let score = 0;

  quizData.questions.forEach((currentQuestion, questionNumber) => {
    const selectedOption = document.querySelector(`input[name="question${questionNumber}"]:checked`);
    if (selectedOption && selectedOption.value === quizData.answerKey[questionNumber]) {
      score += 1;
    }
  });

  return score;
}

function showScoreSummary(quizData) {
  const score = calculateScore(quizData);
  const totalQuestions = quizData.questions.length;

  // Display the score
  scoreText.textContent = `You scored ${score} out of ${totalQuestions}`;

  // Hide quiz and show score summary
  quizContainer.style.display = 'none';
  submitButton.style.display = 'none';
  scoreSummary.style.display = 'block';
}

// Show detailed feedback for each answer
function reviewAnswers(quizData) {
  scoreSummary.style.display = 'none';
  quizContainer.style.display = 'block';

  quizData.questions.forEach((currentQuestion, questionNumber) => {
    const selectedOption = document.querySelector(`input[name="question${questionNumber}"]:checked`);
    const correctAnswer = quizData.answerKey[questionNumber];
    const options = document.querySelectorAll(`input[name="question${questionNumber}"]`);

    // Highlight each option based on correctness
    options.forEach((option) => {
      if (option.value === correctAnswer) {
        option.parentElement.style.color = 'green';
      } else if (selectedOption && option === selectedOption && selectedOption.value !== correctAnswer) {
        option.parentElement.style.color = 'red';
      }
    });
  });
}

// Add event listener to submit button
submitButton.addEventListener('click', () => {
  chrome.storage.local.get(['quizResult'], (result) => {
    if (result.quizResult) {
      showScoreSummary(result.quizResult); // Show score summary after submission
    }
  });
});

// Add event listener to review answers button
reviewAnswersButton.addEventListener('click', () => {
  chrome.storage.local.get(['quizResult'], (result) => {
    if (result.quizResult) {
      reviewAnswers(result.quizResult); // Show detailed feedback on review
    }
  });
});

// Load quiz data from Chrome storage and initialize the quiz
chrome.storage.local.get(['quizResult'], (result) => {
  if (result.quizResult) {
    buildQuiz(result.quizResult); // Populate the quiz with stored data
  } else {
    quizContainer.innerHTML = '<p>No quiz data available.</p>';
  }
});
