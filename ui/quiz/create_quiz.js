import { handleQuizSubmission } from './quiz.js';

// Function to display quiz data
export function displayQuiz(quizData) {
  const quizContainer = document.getElementById('quizContainer');
  quizContainer.innerHTML = ''; // Clear loading text

  // Display instructions
  if (quizData.instructions) {
    const instructions = document.createElement('p');
    instructions.textContent = quizData.instructions;
    quizContainer.appendChild(instructions);
  }

  // Display each question
  quizData.questions.forEach((q, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    // Question text
    const questionText = document.createElement('p');
    questionText.textContent = `${index + 1}. ${q.question}`;
    questionDiv.appendChild(questionText);

    // Options
    const optionsList = document.createElement('ul');
    optionsList.classList.add('options');
    for (const [key, value] of Object.entries(q.options)) {
      const optionItem = document.createElement('li');
      const optionLabel = document.createElement('label');

      const optionInput = document.createElement('input');
      optionInput.type = 'radio';
      optionInput.name = `question${index}`;
      optionInput.value = key;

      optionLabel.appendChild(optionInput);
      optionLabel.append(` ${key}) ${value}`);

      optionItem.appendChild(optionLabel);
      optionsList.appendChild(optionItem);
    }

    questionDiv.appendChild(optionsList);
    quizContainer.appendChild(questionDiv);
  });

  // Add a submit button
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  quizContainer.appendChild(submitButton);

  // Add event listener to handle quiz submission
  submitButton.addEventListener('click', () => {
    handleQuizSubmission(quizData);
  });
}
