let trackButton = document.getElementById('trackBtn');
let parentDiv = document.getElementById('parentDiv');

trackButton.addEventListener('click', function() {
    // send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
            chrome.storage.sync.get(['title'], function(result) {
                console.log('Title currently is ' + result.title);
                let headerElem = document.createElement('h1');
                headerElem.textContent = result.title;
                document.body.appendChild(headerElem);
            });
        });
    });
});
