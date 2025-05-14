let interval = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Productivity Tracker Extension Installed");
});

// Listen for when a tab becomes active
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  clearInterval(interval); // Clear previous interval
  console.log("🔄 Tab activated:", activeInfo.tabId);
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab && tab.url && isValidUrl(tab.url)) {
      console.log("📌 Switched to valid tab:", tab.url);
      startTracking(tab);
    } else {
      console.warn("⚠️ Invalid or non-HTTP tab:", tab.url);
    }
  } catch (err) {
    console.error("❌ Error getting tab info:", err.message);
  }
});

// Listen for tab updates (like navigating to a new page)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete" && isValidUrl(tab.url)) {
    console.log("🔄 Tab updated:", tab.url);
    clearInterval(interval);
    startTracking(tab);
  }
});

// Helper: Validate a URL
function isValidUrl(url) {
  const isValid = url && !url.startsWith("chrome://");
  console.log("🔍 Validating URL:", url, isValid ? "Valid" : "Invalid");
  return isValid;
}

// Helper: Retrieve stored token
async function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["token"], (result) => {
      console.log("🔑 Retrieved token:", result.token ? "Present" : "Missing");
      resolve(result.token);
    });
  });
}

// Helper: Get page content from content script
async function getPageContent(tabId) {
  return new Promise((resolve, reject) => {
    console.log("📬 Sending message to content script for tab:", tabId);
    const timeout = setTimeout(() => {
      console.warn("⚠️ Content script timed out");
      reject(new Error("Content script timeout"));
    }, 5000);
    chrome.tabs.sendMessage(tabId, { action: "getPageContent" }, (response) => {
      clearTimeout(timeout);
      if (chrome.runtime.lastError) {
        console.error("❌ Content script error:", chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError);
      } else {
        console.log("📄 Content script response:", response ? `Content length: ${response.content.length}` : "No content");
        resolve(response ? response.content : '');
      }
    });
  });
}

// Helper: Add context based on domain
function addProductivityContext(hostname, content) {
  const productiveDomains = ['stackoverflow.com', 'github.com', 'docs.microsoft.com'];
  const isProductive = productiveDomains.some(domain => hostname.includes(domain));
  return isProductive ? `Productive activity: ${content}` : `Leisure activity: ${content}`;
}

// Start tracking the active tab every 1 minute
async function startTracking(tab) {
  console.log("🚀 Starting tracking for tab:", tab.url);
  interval = setInterval(async () => {
    const url = tab.url;
    const hostname = new URL(url).hostname;

    console.log("🕒 Classifying activity for:", hostname);

    const token = await getToken();
    if (!token) {
      console.warn("⚠️ No auth token found. Skipping.");
      return;
    }

    try {
      // Try to get page content
      let content = '';
      try {
        content = await getPageContent(tab.id);
      } catch (contentErr) {
        console.warn("⚠️ Failed to extract content:", contentErr.message);
        // Fallback: Use tab title or hostname
        content = tab.title || hostname;
        console.log("📄 Falling back to title/hostname:", content);
      }

      if (!content) {
        console.warn("⚠️ No content or title available. Using hostname as fallback.");
        content = hostname;
      }

      // Add context for productive domains
      const enrichedContent = addProductivityContext(hostname, content);
      console.log("📄 Final content length:", enrichedContent.length);

      // Call classification API
      console.log("📡 Sending classification request to /api/classify");
      const classifyRes = await fetch("http://localhost:5000/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: enrichedContent.substring(0, 1000) }), // Limit to 1000 characters
      });

      if (!classifyRes.ok) {
        const text = await classifyRes.text();
        throw new Error(`HTTP error! status: ${classifyRes.status}, statusText: ${classifyRes.statusText}, body: ${text}`);
      }

      const classifyData = await classifyRes.json();
      const isProductive = classifyData.label === "productive";
      console.log(`✅ Classified as ${classifyData.label} (${classifyData.score})`);

      // Update time in backend
      console.log("📡 Sending time update to /api/time/update-time");
      const updateRes = await fetch("http://localhost:5000/api/time/update-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          seconds: 60, // 1 minute
          isProductive,
        }),
      });

      if (!updateRes.ok) {
        const text = await updateRes.text();
        throw new Error(`HTTP error! status: ${updateRes.status}, statusText: ${updateRes.statusText}, body: ${text}`);
      }

      const updateData = await updateRes.json();
      console.log("📊 Time update response:", updateData);
    } catch (err) {
      console.error("❌ Error during tracking:", err.message);
    }
  }, 60000); // Run every 60 seconds
}