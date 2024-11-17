// Redirect to the quiz page on button click
// document.getElementById('startQuiz').addEventListener('click', () => {
//     chrome.storage.local.get(['quizResult'], (result) => {
//       if (result.quizResult) {
//         // Open the side panel with the quiz content
//         chrome.sidePanel.setOptions({
//           path: 'sidepanel.html',
//           enabled: true,
//         }, () => {
//           chrome.sidePanel.open();
//         });
//       } else {
//         alert("Quiz data isn't ready yet. Please highlight text and select 'Check for Understanding' first.");
//       }
//     });
//   });


  
document.getElementById('startQuiz').addEventListener('click', () => {
    chrome.storage.local.get(['quizResult'], (result) => {
      if (result.quizResult) {
        // Redirect to the loading page before the side panel
        window.location.href = 'loading.html';
      } else {
        alert("Quiz data isn't ready yet. Please highlight text and select 'Check for Understanding' first.");
      }
    });
  });
  