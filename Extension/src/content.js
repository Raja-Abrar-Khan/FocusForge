console.log("Content script loaded");

// Function to extract visible text from the page
function extractPageContent() {
  return new Promise((resolve) => {
    // Wait for page to stabilize
    setTimeout(() => {
      let textContent = '';

      // Method 1: Visible text from body
      if (document.body.innerText) {
        textContent = document.body.innerText.trim();
      }

      // Method 2: Text from visible elements (excluding hidden ones)
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
            textContent += node.textContent.trim() + ' ';
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

      console.log("Extracted content length:", textContent.length);
      resolve(textContent);
    }, 1000); // Wait 1s for dynamic content
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