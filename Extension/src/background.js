/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
let intervalId = null;
let isTracking = false;
let lastUpdateTime = 0;
const UPDATE_INTERVAL = 300000; // 5 minutes
let activityBuffer = [];
let isExtensionEnabled = true;

chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ FocusForge Extension Installed");
  chrome.storage.local.set({ isExtensionEnabled: true });
});

chrome.runtime.onStartup.addListener(() => {
  console.log("🌅 Browser started, resetting tracking");
  activityBuffer = [];
  lastUpdateTime = 0;
  checkExtensionState();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.isExtensionEnabled) {
    isExtensionEnabled = changes.isExtensionEnabled.newValue;
    console.log(`🔄 Extension ${isExtensionEnabled ? 'enabled' : 'disabled'}`);
    if (!isExtensionEnabled) {
      clearTrackingInterval();
      activityBuffer = [];
      console.log("🛑 Tracking stopped due to extension disable");
    }
  }
});

chrome.idle.setDetectionInterval(300); // Detect idle after 5 minutes
chrome.idle.onStateChanged.addListener((state) => {
  console.log(`💤 Idle state changed: ${state}`);
  if (state === 'idle' || state === 'locked') {
    clearTrackingInterval();
    console.log("🛑 Tracking paused due to idle/locked state");
  } else if (state === 'active' && isExtensionEnabled && isValidUrl(getActiveTabUrl())) {
    console.log("🚀 Resuming tracking on active state");
    startTracking(getActiveTab());
  }
});

function clearTrackingInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("🛑 Tracking interval cleared");
  }
}

function isValidUrl(url) {
  const isValid = url &&
    (url.startsWith("http://") || url.startsWith("https://")) &&
    !url.startsWith("chrome://") &&
    !url.startsWith("devtools://");
  console.log(`🔍 Validating URL: ${url} -> ${isValid ? "Valid" : "Invalid"}`);
  return isValid;
}

function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0] || null);
    });
  });
}

function getActiveTabUrl() {
  return new Promise((resolve) => {
    getActiveTab().then((tab) => resolve(tab ? tab.url : ''));
  });
}

async function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["token"], (result) => {
      console.log(`🔑 Token: ${result.token ? "Present" : "Missing"}`);
      resolve(result.token || null);
    });
  });
}

async function getPageContent(tabId) {
  return new Promise((resolve) => {
    console.log(`📬 Requesting content from tab ${tabId}`);
    const timeout = setTimeout(() => {
      console.warn("⚠️ Content script timed out");
      resolve({ content: "", error: "Timeout" });
    }, 5000);

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

async function captureScreenshot(tabId) {
  let attempts = 0;
  const maxAttempts = 3;

  try {
    const tab = await chrome.tabs.get(tabId);
    console.log(`🔎 Tab state: id=${tabId}, status=${tab.status}, url=${tab.url}`);
    if (!isValidUrl(tab.url)) {
      console.warn(`⚠️ Invalid URL for screenshot: ${tab.url}`);
      return { imageBase64: null, error: "Invalid URL" };
    }
    if (tab.status !== "complete") {
      console.log(`⏳ Tab not ready, delaying 2s`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    await chrome.tabs.update(tabId, { active: true });
    if (tab.url.includes('meet.google.com')) {
      console.log(`⏳ Google Meet detected, delaying 5s`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`📸 Capturing screenshot (attempt ${attempts}/${maxAttempts})`);
        const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: "jpeg", quality: 50 });
        console.log(`🖼️ Screenshot captured, length: ${dataUrl.length}`);
        return { imageBase64: dataUrl, error: null };
      } catch (error) {
        console.warn(`⚠️ Screenshot attempt ${attempts} failed: ${error.message}`);
        if (attempts === maxAttempts) {
          console.error(`❌ Screenshot failed after ${maxAttempts} attempts`);
          return { imageBase64: null, error: error.message };
        }
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempts));
      }
    }
  } catch (error) {
    console.error(`❌ Tab query error: ${error.message}`);
    return { imageBase64: null, error: error.message };
  }
}

function preprocessText(content, hostname) {
  let text = content.replace(/\s+/g, ' ').trim().substring(0, 5000);
  text = text.replace(/paused due to problems with your network/gi, '');
  text = text.replace(/connection issue/gi, '');
  if (hostname.includes('youtube.com')) {
    text = `Potential study content: ${text}`;
  } else if (hostname.includes('meet.google.com')) {
    text = `Meeting activity: ${text}`;
  } else if (hostname.includes('chess.com')) {
    text = `Gaming activity: ${text}`;
  }
  return text;
}

function deduplicateActivities(buffer) {
  const deduped = new Map();
  for (const activity of buffer) {
    const key = `${activity.url}-${activity.activityType}-${Math.floor(activity.timestamp / 60000)}`; // Per minute
    const existing = deduped.get(key);
    if (!existing || activity.timestamp > existing.timestamp) {
      deduped.set(key, activity);
    }
  }
  return Array.from(duped.values());
}

async function startTracking(tab) {
  if (!isValidUrl(tab.url) || !isExtensionEnabled) {
    console.log(`⛔ Skipping tracking: ${!isValidUrl(tab.url) ? 'Invalid URL' : 'Extension disabled'}`);
    return;
  }
  clearTrackingInterval();
  isTracking = true;
  console.log(`🚀 Starting tracking for tab: ${tab.url}`);

  const processActivity = async () => {
    const now = Date.now();
    if (now - lastUpdateTime < UPDATE_INTERVAL) {
      console.log('⏳ Skipping update: within 5-min interval');
      return;
    }

    const token = await getToken();
    if (!token) {
      console.warn("⚠️ No auth token. Skipping classification.");
      return;
    }

    const state = await new Promise((resolve) => chrome.idle.queryState(300, resolve));
    if (state !== 'active') {
      console.log(`⛔ Skipping classification: System ${state}`);
      return;
    }

    try {
      const hostname = new URL(tab.url).hostname;
      console.log(`🕒 Processing activity for: ${hostname}`);

      const { content } = await getPageContent(tab.id);
      let finalContent = content || tab.title || tab.url || hostname || 'Unknown';
      finalContent = preprocessText(finalContent, hostname);

      const { imageBase64, error: screenshotError } = await captureScreenshot(tab.id);
      if (screenshotError) console.warn(`⚠️ Screenshot error: ${screenshotError}`);

      const classifyRes = await fetch("http://localhost:5000/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text: finalContent.substring(0, 5000),
          imageBase64: imageBase64 || '',
          url: tab.url
        })
      });

      if (!classifyRes.ok) throw new Error(`Classification failed: ${classifyRes.status}`);
      const classifyData = await classifyRes.json();
      console.log(`✅ Classified: ${classifyData.activityType} (${classifyData.label}, Score: ${classifyData.score})`);

      activityBuffer.push({
        seconds: 180,
        isProductive: classifyData.label === 'productive',
        activityType: classifyData.activityType || 'Studying',
        url: tab.url,
        text: finalContent.substring(0, 2000),
        imageBase64: imageBase64 || '',
        score: classifyData.score || 0.9,
        timestamp: now
      });

      const dedupedActivities = deduplicateActivities(activityBuffer);
      console.log(`📊 Deduplicated activities: ${dedupedActivities.length}`);

      for (const activity of dedupedActivities) {
        const updateRes = await fetch("http://localhost:5000/api/time/update-time", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(activity)
        });

        if (!updateRes.ok) throw new Error(`Time update failed: ${updateRes.status}`);
        const updateData = await updateRes.json();
        console.log(`✅ Time updated: ${activity.activityType} (${activity.seconds}s)`);
      }

      activityBuffer = activityBuffer.filter(a => now - a.timestamp < 3600000); // Keep last hour
      lastUpdateTime = now;
    } catch (err) {
      console.error(`❌ Tracking error: ${err.message}`);
    }
  };

  const state = await new Promise((resolve) => chrome.idle.queryState(300, resolve));
  if (state === 'active') {
    await processActivity();
    intervalId = setInterval(processActivity, UPDATE_INTERVAL);
  } else {
    console.log(`⛔ Initial state ${state}, delaying tracking`);
  }
}

async function checkExtensionState() {
  const result = await new Promise((resolve) => chrome.storage.local.get(['isExtensionEnabled'], resolve));
  isExtensionEnabled = result.isExtensionEnabled !== false;
  console.log(`🔄 Extension state: ${isExtensionEnabled ? 'enabled' : 'disabled'}`);
  if (!isExtensionEnabled) clearTrackingInterval();
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  clearTrackingInterval();
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (isValidUrl(tab.url) && isExtensionEnabled) {
      console.log(`🔄 Tab activated: ${tab.url}`);
      startTracking(tab);
    }
  } catch (err) {
    console.error(`❌ Tab activation error: ${err.message}`);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete" && isValidUrl(tab.url) && isExtensionEnabled) {
    console.log(`🔄 Tab updated: ${tab.url}`);
    startTracking(tab);
  }
});