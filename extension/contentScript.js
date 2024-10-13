chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getToS') {
        // Try various potential selectors that might indicate ToS content
        let termsElement = document.querySelector('.terms-of-service') || 
                           document.querySelector('#tos') || 
                           document.querySelector('.terms') ||
                           document.querySelector('.privacy-policy') ||
                           document.querySelector('.user-agreement');

        if (termsElement) {
            sendResponse({ termsContent: termsElement.innerText });
        } else {
            sendResponse({ termsContent: 'No ToS found on this page.' });
        }
    }
});
