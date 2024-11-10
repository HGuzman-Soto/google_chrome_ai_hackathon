// content.js

// Function to collect useful data from the webpage
function collectPageData() {
  const pageTitle = document.title;
  const pageURL = window.location.href;
  const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText);
  const boldText = Array.from(document.querySelectorAll('b, strong')).map(b => b.innerText);
  const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.innerText);
  // Extract tables
  const tables = Array.from(document.querySelectorAll('table')).map(table => {
    return Array.from(table.querySelectorAll('tr')).map(row => {
      return Array.from(row.querySelectorAll('th, td')).map(cell => cell.innerText);
    });
  });
  // Collect all the data into an object
  const pageData = {
    title: pageTitle,
    url: pageURL,
    headings: headings,
    boldText: boldText,
    tables: tables, 
    paragraphs: paragraphs
  };

  return pageData;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'collectData') {
    const pageData = collectPageData();
    // Send back both page data and the highlighted text (received from background.js)
    sendResponse({
      data: {
        highlightedText: request.highlightedText || 'No highlighted text',
        pageData: pageData
      }
    });
  }
});

