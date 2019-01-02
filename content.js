chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting == "hello") {
        let header = document.getElementsByTagName('h1')[0];
        let title = header.textContent;
        sendResponse({title: title});
    }
});
