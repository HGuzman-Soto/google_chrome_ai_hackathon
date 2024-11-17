export function showResultsPage(score, totalQuestions, results) {
  const quizContainer = document.getElementById('quiz');
  quizContainer.innerHTML = ''; // Clear existing content

  // Score box
  const scoreBox = document.createElement('div');
  scoreBox.className = 'score-box';
  scoreBox.textContent = `You scored ${score} out of ${totalQuestions}`;
  quizContainer.appendChild(scoreBox);

  // Results container
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'results-container';

  results.forEach((result, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';

    // Question text
    const questionText = document.createElement('p');
    questionText.textContent = `${index + 1}. ${result.question}`;
    questionDiv.appendChild(questionText);

    // Options
    const optionsList = document.createElement('ul');
    for (const [key, value] of Object.entries(result.options)) {
      const optionItem = document.createElement('li');
      optionItem.textContent = `${key}) ${value}`;

      if (key === result.correctAnswer) {
        optionItem.classList.add('correct'); // Highlight correct answer
      } else if (key === result.userAnswer) {
        optionItem.classList.add('incorrect'); // Highlight incorrect answer
      }

      optionsList.appendChild(optionItem);
    }

    questionDiv.appendChild(optionsList);
    resultsContainer.appendChild(questionDiv);
  });

  quizContainer.appendChild(resultsContainer);
}
