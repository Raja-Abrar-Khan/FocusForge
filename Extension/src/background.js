// File: Frontend/background.js
let intervalId = null;
let isTracking = false;

// Initialize on extension install
chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Productivity Tracker Extension Installed");
});

// Clear interval safely
function clearTrackingInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("🛑 Tracking interval cleared");
  }
}

// Validate URL
function isValidUrl(url) {
  const isValid = url && (url.startsWith("http://") || url.startsWith("https://")) && !url.startsWith("chrome://");
  console.log(`🔍 Validating URL: ${url} -> ${isValid ? "Valid" : "Invalid"}`);
  return isValid;
}

// Retrieve auth token
async function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["token"], (result) => {
      console.log(`🔑 Token: ${result.token ? "Present" : "Missing"}`);
      resolve(result.token || null);
    });
  });
}

// Get page content from content script
async function getPageContent(tabId) {
  return new Promise((resolve) => {
    console.log(`📬 Requesting content from tab ${tabId}`);
    const timeout = setTimeout(() => {
      console.warn("⚠️ Content script timed out");
      resolve({ content: "", error: "Timeout" });
    }, 3000);

    chrome.tabs.sendMessage(
      tabId,
      { action: "getPageContent" },
      { frameId: 0 },
      (response) => {
        clearTimeout(timeout);
        if (chrome.runtime.lastError) {
          console.warn(`⚠️ Content script error: ${chrome.runtime.lastError.message}`);
          resolve({ content: "", error: chrome.runtime.lastError.message });
        } else {
          console.log(`📄 Content received: ${response ? response.content.length : 0} chars`);
          resolve({ content: response ? response.content : "", error: null });
        }
      }
    );
  });
}

// Add context based on domain
function addProductivityContext(hostname, content) {
  const productiveDomains = [
    "stackoverflow.com",
    "github.com",
    "docs.microsoft.com",
    "w3schools.com",
    "developer.mozilla.org"
  ];
  const isProductive = productiveDomains.some((domain) => hostname.includes(domain));
  console.log(`🏷️ Context: ${isProductive ? "Productive" : "Leisure"} for ${hostname}`);
  return isProductive ? `Productive activity: ${content}` : `Leisure activity: ${content}`;
}

// Check user idle state with fallback
function setupIdleDetection() {
  if (chrome.idle && typeof chrome.idle.setDetectionInterval === "function") {
    chrome.idle.setDetectionInterval(60); // Check every 60 seconds
    chrome.idle.onStateChanged.addListener((newState) => {
      console.log(`🖱️ Idle state changed: ${newState}`);
      if (newState === "active") {
        if (!isTracking) {
          console.log("▶️ Resuming tracking due to active state");
          resumeTracking();
        }
      } else {
        console.log("⏸️ Pausing tracking due to idle/locked state");
        clearTrackingInterval();
        isTracking = false;
      }
    });
  } else {
    console.warn("⚠️ Idle API unavailable, running without idle detection");
  }
}

// Resume tracking for the active tab
async function resumeTracking() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && isValidUrl(tab.url)) {
      console.log(`🔄 Resuming tracking for tab: ${tab.url}`);
      startTracking(tab);
    }
  } catch (err) {
    console.error(`❌ Error resuming tracking: ${err.message}`);
  }
}

// Start tracking
async function startTracking(tab) {
  clearTrackingInterval();
  isTracking = true;
  console.log(`🚀 Starting tracking for tab: ${tab.url}`);

  intervalId = setInterval(async () => {
    const token = await getToken();
    if (!token) {
      console.warn("⚠️ No auth token. Skipping classification.");
      return;
    }

    try {
      const hostname = new URL(tab.url).hostname;
      console.log(`🕒 Processing activity for: ${hostname}`);

      // Get page content
      const { content, error } = await getPageContent(tab.id);
      let finalContent = content;

      if (error || !content) {
        console.warn(`⚠️ Using fallback content: ${error || "No content"}`);
        finalContent = tab.title || tab.url || hostname || "Unknown page";
      }

      // Add context
      const enrichedContent = addProductivityContext(hostname, finalContent);
      console.log(`📄 Content length: ${enrichedContent.length}`);

      // Classify activity
      console.log("📡 Classifying content...");
      const classifyRes = await fetch("http://localhost:5000/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: enrichedContent.substring(0, 1000) })
      });

      if (!classifyRes.ok) {
        const text = await classifyRes.text();
        throw new Error(`Classification failed: ${classifyRes.status} ${text}`);
      }

      const classifyData = await classifyRes.json();
      const isProductive = classifyData.label === "productive";
      console.log(`✅ Classified as ${classifyData.label} (Score: ${classifyData.score})`);

      // Update time for both productive and unproductive
      console.log("📡 Updating time...");
      const updateRes = await fetch("http://localhost:5000/api/time/update-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          seconds: 60,
          isProductive
        })
      });

      if (!updateRes.ok) {
        const text = await updateRes.text();
        throw new Error(`Time update failed: ${updateRes.status} ${text}`);
      }

      const updateData = await updateRes.json();
      console.log(`📊 Time updated: ${JSON.stringify(updateData)}`);
    } catch (err) {
      console.error(`❌ Tracking error: ${err.message}`);
    }
  }, 60000);
}

// Tab activation listener
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  clearTrackingInterval();
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab && isValidUrl(tab.url)) {
      console.log(`🔄 Tab activated: ${tab.url}`);
      startTracking(tab);
    } else {
      console.warn(`⚠️ Invalid tab: ${tab.url || "No URL"}`);
    }
  } catch (err) {
    console.error(`❌ Error on tab activation: ${err.message}`);
  }
});

// Tab update listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete" && isValidUrl(tab.url)) {
    console.log(`🔄 Tab updated: ${tab.url}`);
    clearTrackingInterval();
    startTracking(tab);
  }
});

// Initialize idle detection
setupIdleDetection();