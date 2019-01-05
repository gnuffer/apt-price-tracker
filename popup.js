let trackButton = document.getElementById('trackBtn');
let parentDiv = document.getElementById('parentDiv');

trackButton.addEventListener('click', function() {
    // send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
            chrome.storage.local.get(null, function(result) {
                //console.log('The new entry is ' + result.entry);
                console.log(result);
                let listElem = document.createElement('ul');
                for (let date in result) {
                    if (result.hasOwnProperty(date)) {
                        let listItem = document.createElement('li');
                        let listValue = document.createTextNode(result[date]);
                        listItem.appendChild(listValue);
                        listElem.appendChild(listItem);
                    }
                }
                document.body.appendChild(listElem);
                    

//                let headerElem = document.createElement('h1');
//                headerElem.textContent = result;
//                document.body.appendChild(headerElem);
//                chrome.storage.local.clear(function() {
//                    var error = chrome.runtime.lastError;
//                    if (error) {
//                        console.error(error);
//                    } else {
//                        console.log('storage clear');
//                    }
//                });
            });
        });
    });
});
