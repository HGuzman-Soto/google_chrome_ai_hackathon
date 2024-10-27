// sidepanel.js

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'openSidePanel') {
      openSidePanel(request.text);
    }
  });
  
  function openSidePanel(selectedText) {
    // Check if the side panel already exists
    if (document.getElementById('myExtensionSidePanel')) {
      return;
    }
  
    // Create the side panel container
    const sidePanel = document.createElement('div');
    sidePanel.id = 'myExtensionSidePanel';
  
    // Style the side panel
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
  
    // Add content to the side panel
    sidePanel.innerHTML = `
      <button id="closeSidePanel" style="float:right;">&times;</button>
      <h2>Quiz</h2>
      <p>${selectedText}</p>
      <!-- You can add more interactive elements here -->
    `;
  
    // Append the side panel to the body
    document.body.appendChild(sidePanel);
  
    // Add event listener to close the side panel
    document.getElementById('closeSidePanel').addEventListener('click', () => {
      sidePanel.remove();
    });
  }