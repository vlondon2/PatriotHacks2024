chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getToS') {
        // Assuming the ToS is inside an element with an id or class like "terms-of-service"
        let termsElement = document.querySelector('.terms-of-service') || document.querySelector('#tos');
        
        if (termsElement) {
            sendResponse({ termsContent: termsElement.innerText });
        } else {
            sendResponse({ termsContent: 'No ToS found on this page.' });
        }
    }
});
