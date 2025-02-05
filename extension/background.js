// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTabURL") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                sendResponse({ url: tabs[0].url });  // Send the URL of the active tab
            } else {
                sendResponse({ error: 'No active tab found' });
            }
        });
        // Keep the message channel open for async response
        return true;
    }
});

chrome.runtime.onInstalled.addListener(() => {
    console.log("Background script loaded");
});