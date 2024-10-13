// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log("Received message:", message);
//     if (message.foundTerms) {
//         const currentUrl = sender.tab.url; // Get the current URL
//         console.log("Terms of Service detected for:", currentUrl);

//         // Check if the current URL has already triggered a notification
//         if (chrome.storage && chrome.storage.local) { // Check if chrome.storage.local is defined
//             chrome.storage.local.get(['notifiedSites'], (result) => {
//                 let notifiedSites = result.notifiedSites || [];

//                 if (!notifiedSites.includes(currentUrl)) {
//                     console.log("New site detected. Showing notification and storing the URL.");

//                     // Send the terms content to your backend
//                     const tosText = message.termsContent; // Assume the ToS text is available in the message
//                     fetch('http://localhost:8000/api/tos-summarize/', {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json'
//                         },
//                         body: JSON.stringify({ text: tosText }) // Sending 'text' as per your view
//                     })
//                     .then(response => response.json())
//                     .then(data => {
//                         console.log('Terms sent to backend:', data);

//                         // Notify the popup with the doc_id
//                         chrome.notifications.create({ // Removed notificationId here
//                             type: "basic",
//                             iconUrl: "pthackslogo.png",
//                             title: "Terms of Service Detected!",
//                             message: "This page contains Terms of Service information.",
//                             priority: 2,
//                         }, (notificationId) => {
//                             // Callback to handle the notification ID if needed
//                             console.log("Notification created with ID:", notificationId);

//                             // Send message to the popup to open and pass the doc_id
//                             chrome.runtime.sendMessage({ docId: data.id });
//                         });
//                     })
//                     .catch(error => {
//                         console.error('Error sending terms to backend:', error);
//                     });

//                     // Add the current URL to the notified sites
//                     notifiedSites.push(currentUrl);
//                     chrome.storage.local.set({ notifiedSites: notifiedSites }); // Store the updated list
//                 } else {
//                     console.log("Notification already shown for this site.");
//                 }
//             });
//         } else {
//             console.error("chrome.storage is not available.");
//         }
//     }
// });
