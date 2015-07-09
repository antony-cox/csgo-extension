chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var options = {
            type: request.type,
            title: request.title,
            message: request.message,
            iconUrl: request.iconUrl
        };

        setTimeout(function() { createNotification(options); }, request.timeout);
    });

function createNotification(options) {
    chrome.notifications.create("", options);
}