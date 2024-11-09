// sidepanel.js

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
      document.getElementById('quizContainer').innerText = 'Quiz data not available.';
    }
  });
}


// Function to display quiz data
function displayQuiz(quizData) {
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

// Listen for new quiz data being stored
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'quizUpdated') {
    // Open or refresh the side panel with the new quiz data
    openSidePanel();
  }
});

function handleQuizSubmission(quizData) {
  let score = 0;

  quizData.questions.forEach((q, index) => {
    const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
    const optionsList = document.querySelectorAll(`input[name="question${index}"]`);
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