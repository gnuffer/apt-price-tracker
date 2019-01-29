// gets 'Track Price' button of popup
let trackButton = document.getElementById('trackBtn');

// checks if a given array matches the current array at indices 1, 2, 3 (here: zip code, area, number of rooms)
function matchesCurrent(array, current) {
//    try {
//        if (array.length !== current.length) {
//            throw ('Arrays of unequal length cannot be compared!');
//        }
//    } catch (e) {
//        console.log(e);
//    }
    if (array.length !== current.length) {
        throw new Error('Arrays of unequal length cannot be compared!');
    } 
    for (let i = 1; i < 4; i++) {
        if (array[i] !== current[i]) {
            return false;
        }
    }
    return true;
}

// listens for clicks on the 'Track price' button of popup
trackButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // sends message to content script
        chrome.tabs.sendMessage(tabs[0].id, {message: "Track button clicked"}, function(response) {

            // creates a date string from the response object sent back by content script
            let dateStr = response.currentDate;

            // retrieves everything stored in chrome storage (the entire storage object)
            chrome.storage.local.get(null, function(result) {

                // gets the storage entry created by the current click event
                let current = result[dateStr];

                let listElem = document.createElement('ul');

                // iterates over the properties of the result object retrieved from storage and filters
                // out those property values (arrays) that match the array of the currently clicked item.
                for (let date in result) {
                    if (result.hasOwnProperty(date) && matchesCurrent(result[date], current)) {
                        let listItem = document.createElement('li');
                        // creates date - price entry to be displayed in popup
                        let listItemTextContent = result[date][0] + ' -- ' + result[date][4];

                        // checks if price string starts with a digit.  If so, it appends the euro symbol
                        if (!isNaN(parseInt(result[date][4][0], 10))) {
                            listItemTextContent += ' \u20AC';
                        } 

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
