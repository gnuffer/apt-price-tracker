chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting == "hello") {
        let header = document.getElementsByTagName('h1')[0];
        let title = header.textContent;
        let date = new Date();
        let dateStr = date.toString();
        let entryStr = title + '  ' + dateStr;
        let entry = {};
        entry[dateStr] = entryStr;
        chrome.storage.local.set(entry, function() {
            console.log('The new entry is: ' + entryStr);
            sendResponse({title: title});
        });
    }
});
