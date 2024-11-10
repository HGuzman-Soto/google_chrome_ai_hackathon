export function handleQuizSubmission(quizData) {
  let score = 0;

  quizData.questions.forEach((q, index) => {
    const selectedOption = document.querySelector(
      `input[name="question${index}"]:checked`
    );
    const optionsList = document.querySelectorAll(
      `input[name="question${index}"]`
    );
    let correctAnswer = quizData.answerKey[index];

    // Iterate through all options to mark correct and incorrect answers
    optionsList.forEach((option) => {
      const optionLabel = option.parentElement;

      if (option.value === correctAnswer) {
        // Highlight the correct answer
        optionLabel.classList.add('correct');
      }

      if (selectedOption) {
        const userAnswer = selectedOption.value;
        if (userAnswer === correctAnswer) {
          score++;
        } else if (option === selectedOption) {
          // Highlight the incorrect answer selected by the user
          optionLabel.classList.add('incorrect');
        }
      }
    });
  });

  // Display the score
  alert(`You scored ${score} out of ${quizData.questions.length}`);
}
