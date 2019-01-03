chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting == "hello") {
        let header = document.getElementsByTagName('h1')[0];
        let title = header.textContent;
        chrome.storage.sync.set({title: title}, function() {
            console.log('Title is set to ' + title);
            sendResponse({title: title});
        });

    }
});
