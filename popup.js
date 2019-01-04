let trackButton = document.getElementById('trackBtn');
let parentDiv = document.getElementById('parentDiv');

trackButton.addEventListener('click', function() {
    // send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
            chrome.storage.sync.get(['entry'], function(result) {
                console.log('The new entry is ' + result.entry);
                let headerElem = document.createElement('h1');
                headerElem.textContent = result.entry;
                document.body.appendChild(headerElem);
            });
        });
    });
});
