// Redirect to the quiz page on button click
document.getElementById('startQuiz').addEventListener('click', () => {
    chrome.storage.local.get(['quizResult'], (result) => {
      if (result.quizResult) {
        window.location.href = 'popup.html'; // Navigate to the quiz if data is ready
      } else {
        alert("Quiz data isn't ready yet. Please highlight text and select 'Check for Understanding' first.");
      }
    });
  });
  