chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var options = {
            type: request.type,
            title: request.title,
            message: request.message,
            iconUrl: request.iconUrl
        };

        setTimeout(function() { createNotification(request.id, options); }, request.timeout);
    });

function createNotification(id, options) {
    chrome.notifications.create(""+id, options);
}