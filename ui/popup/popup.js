const quizData = [
  {
    question: 'What is the capital of France?',
    options: ['Berlin', 'London', 'Paris', 'Madrid'],
    correct: 'Paris',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    correct: 'Mars',
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: [
      'Charles Dickens',
      'William Shakespeare',
      'Mark Twain',
      'Leo Tolstoy',
    ],
    correct: 'William Shakespeare',
  },
  {
    question: 'What is the largest mammal?',
    options: ['Elephant', 'Blue Whale', 'Giraffe', 'Great White Shark'],
    correct: 'Blue Whale',
  },
  {
    question: 'What is the boiling point of water?',
    options: ['9C', '50C', '100C', '150C'],
    correct: '100C',
  },
];

const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submit');

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
            ${option}
          </label>
        </li>`
      );
    });

    output.push(
      `<div class="question">
        <p>${currentQuestion.question}</p>
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
      } else if (userAnswer && option === userAnswer && userAnswer.value !== correctAnswer) {
        // Incorrect answer highlighted in red
        option.parentElement.style.color = 'red';
      }
    });
  });

  alert(`Quiz completed! Check the highlights for correct and incorrect answers.`);
}

// Load quiz data from Chrome storage and initialize the quiz
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
      showResults(result.quizResult); // Show results using stored data
    }
  });
});