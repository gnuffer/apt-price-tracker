// gets 'Track' button of popup
let trackButton = document.getElementById('trackBtn');

// gets 'Tracked' button of popup
let trackedButton = document.getElementById('trackedBtn');

// checks if a given array matches the current array at indices 1, 2, 3 (here: zip code, area, number of rooms)
function matchesCurrent(array, current) {
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

document.addEventListener("DOMContentLoaded", function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // checks if current page contains the expose of a single apartment
        if(tabs[0].url.indexOf('expose') > -1) {
            console.log('You are looking at an expose');

            // hides trackedButton
            trackedButton.hidden = true;

            // listens for clicks on the 'Track' button of popup
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
          // checks if current page contains list with search results
        } else if (tabs[0].url.indexOf('liste') > -1) {
            console.log('You are looking at a list with search results');

            // hides trackButton
            trackButton.hidden = true;

            trackedButton.addEventListener('click', function() {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

                    // retrieves everything stored in chrome storage (the entire storage object)
                    chrome.storage.local.get(null, function(result) {
                        // TODO: build list of tracked items



                    });
                });
            });
        }
    });
});

