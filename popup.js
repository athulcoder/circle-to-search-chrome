document.getElementById("start").addEventListener("click", async () => {
  // find the active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // inject the content script into it
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
});
