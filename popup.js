const quizData = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "London", "Paris", "Madrid"],
    correct: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correct: "Mars"
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Leo Tolstoy"],
    correct: "William Shakespeare"
  },
  {
    question: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"],
    correct: "Blue Whale"
  },
  {
    question: "What is the boiling point of water?",
    options: ["9C", "50C", "100C", "150C"],
    correct: "100C"
  }
];

const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submit');

function buildQuiz() {
  const output = [];

  quizData.forEach((currentQuestion, questionNumber) => {
    const options = [];

    currentQuestion.options.forEach(option => {
      options.push(
        `<li>
          <label>
            <input type="radio" name="question${questionNumber}" value="${option}">
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

function showResults() {
  let score = 0;

  quizData.forEach((currentQuestion, questionNumber) => {
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = (document.querySelector(selector) || {}).value;

    if (userAnswer === currentQuestion.correct) {
      score++;
    }
  });

  alert(`You scored ${score} out of ${quizData.length}`);
}

buildQuiz();

submitButton.addEventListener('click', showResults);
