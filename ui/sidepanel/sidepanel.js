// sidepanel.js
import displayQuiz from './quiz.js';

// Add CSS styles dynamically for correct and incorrect answers
function addQuizStyles() {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    .correct {
      background-color: #d4edda; /* Light green background */
      color: #155724; /* Dark green text */
    }
    .incorrect {
      background-color: #f8d7da; /* Light red background */
      color: #721c24; /* Dark red text */
    }
  `;
  document.head.appendChild(styleElement);
}

// Call this function when opening the side panel
addQuizStyles();

// Listen for messages to open the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'openSidePanel') {
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

  // Add event listener to close the side panel
  document.getElementById('closeSidePanel').addEventListener('click', () => {
    sidePanel.remove();
  });

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

// Listen for new quiz data being stored
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'quizUpdated') {
    // Open or refresh the side panel with the new quiz data
    openSidePanel();
  }
});
