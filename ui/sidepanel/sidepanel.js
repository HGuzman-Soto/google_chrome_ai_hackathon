// sidepanel.js
import { displayQuiz } from '../quiz/create_quiz.js';

// IDK if this is still being used? - Listen for new quiz data being stored
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('Received message in sidePanel.js:', request);
  if (request.type === 'quizUpdated') {
    // Refresh the side panel with the new quiz data
    openSidePanel();
  }
});

function openSidePanel() {
  let sidePanel = document.getElementById('myExtensionSidePanel');
  if (!sidePanel) {
    // Create the side panel container if it doesn't exist
    sidePanel = document.createElement('div');
    sidePanel.id = 'myExtensionSidePanel';
    Object.assign(sidePanel.style, {
      position: 'fixed',
      top: '0',
      right: '0',
      width: '400px',
      height: '100%',
      backgroundColor: '#fff',
      zIndex: '9999',
      boxShadow: '-2px 0 5px rgba(0,0,0,0.3)',
      overflowY: 'auto',
      padding: '20px',
      borderLeft: '1px solid #ccc',
      fontFamily: 'Arial, sans-serif',
    });
    document.body.appendChild(sidePanel);
  }

  // Replace the content of the side panel with the new quiz
  sidePanel.innerHTML = `
    <button id="closeSidePanel" style="float:right;">&times;</button>
    <h2>Quiz</h2>
    <div id="quizContainer">Loading quiz...</div>
  `;

  // Retrieve and display the new quiz data
  chrome.storage.local.get(['quizResult'], (result) => {
    const quizData = result.quizResult;
    if (quizData) {
      displayQuiz(quizData);
    } else {
      document.getElementById('quizContainer').innerText =
        'Quiz data not available.';
    }
  });
}
