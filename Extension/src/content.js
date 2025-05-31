// File: Frontend/content.js
console.log("Content script loaded");

// Function to extract visible text from the page
function extractPageContent() {
  return new Promise((resolve) => {
    setTimeout(() => {
      let textContent = '';

      // Meeting-specific extraction for Google Meet
      if (window.location.hostname.includes('meet.google.com')) {
        const titleElement = document.querySelector('title') || document.querySelector('[data-meeting-title]');
        const participantElements = document.querySelectorAll('[data-participant-name], [data-participant-count]');
        textContent = titleElement?.textContent || document.title || 'Google Meet';
        if (participantElements.length) {
          const participants = Array.from(participantElements)
            .map(el => el.textContent.trim())
            .filter(t => t);
          textContent += ` Participants: ${participants.join(', ')}`;
        }
        // Filter negative phrases
        textContent = textContent.replace(/paused due to problems with your network/gi, '');
        textContent = textContent.replace(/connection issue/gi, '');
        textContent = textContent.trim() || 'Google Meet active';
      }

      // General text extraction
      if (!textContent) {
        // Method 1: Visible text from body
        if (document.body.innerText) {
          textContent = document.body.innerText.trim().replace(/\s+/g, ' ');
        }

        // Method 2: Text from visible elements
        if (!textContent) {
          try {
            const walker = document.createTreeWalker(
              document.body,
              NodeFilter.SHOW_TEXT,
              {
                acceptNode: (node) => {
                  const style = window.getComputedStyle(node.parentElement);
                  return (style.display !== 'none' && 
                          style.visibility !== 'hidden' && 
                          !node.parentElement.hasAttribute('aria-hidden'))
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
                },
              }
            );
            let node;
            while ((node = walker.nextNode())) {
              const text = node.textContent.trim();
              if (text) textContent += text + ' ';
            }
            textContent = textContent.trim();
          } catch (err) {
            console.warn("⚠️ TreeWalker error:", err.message);
          }
        }

        // Method 3: Fallback to document title or URL
        if (!textContent) {
          textContent = document.title || window.location.hostname;
        }

        // Filter negative phrases
        textContent = textContent.replace(/paused due to problems with your network/gi, '');
        textContent = textContent.replace(/connection issue/gi, '');
      }

      // Limit to 2000 chars
      textContent = textContent.substring(0, 2000);
      console.log("Extracted content length:", textContent.length);
      resolve(textContent);
    }, 1500); // Increased delay
  });
}

// Respond to messages from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    console.log("Received getPageContent request");
    extractPageContent().then((content) => {
      console.log("Sending content to background, length:", content.length);
      sendResponse({ content });
    });
    return true; // Keep message channel open for async response
  }
});