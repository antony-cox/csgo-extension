var notifications = [];

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.getNotifications)
        {
            sendResponse({notifications: notifications});
        }

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
    notifications[id] = options.title;
}