let trackButton = document.getElementById('trackBtn');

function sameAsCurrent(array, current) {
    if (array.length !== current.length) {
        return false;
    } else {
        for (let i = 1; i < 4; i++) {
            if (array[i] !== current[i]) {
                return false;
            }
        }
        return true;
    }
}

trackButton.addEventListener('click', function() {
    // send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "Track button clicked"}, function(response) {
            
            let dateStr = response.currentDate;

            chrome.storage.local.get(null, function(result) {

                let current = result[dateStr];

                let listElem = document.createElement('ul');

                for (let date in result) {
                    if (result.hasOwnProperty(date) && sameAsCurrent(result[date], current)) {
                        let listItem = document.createElement('li');
                        let listItemTextContent = result[date][0] + ' -- ' + result[date][4];
                        let listItemValue = document.createTextNode(listItemTextContent);
                        listItem.appendChild(listItemValue);
                        listElem.appendChild(listItem);
                    }
                }
                document.body.appendChild(listElem);
            });
        });
    });
});
