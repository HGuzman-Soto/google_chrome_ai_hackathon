import { showResultsPage } from '../results/results_page.js';

export function handleQuizSubmission(quizData) {
  let score = 0;
  const results = [];

  quizData.questions.forEach((q, index) => {
    const selectedOption = document.querySelector(
      `input[name="question${index}"]:checked`
    );
    const correctAnswer = quizData.answerKey[index];
    const userAnswer = selectedOption ? selectedOption.value : null;

    results.push({
      question: q.question,
      options: q.options,
      correctAnswer,
      userAnswer,
    });

    if (userAnswer === correctAnswer) {
      score++;
    }
  });

  showResultsPage(score, quizData.questions.length, results);
}
