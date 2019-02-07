// gets "Track" button from popup
let trackButton = document.getElementById('trackBtn');

// gets "Tracked" button from popup
let trackedButton = document.getElementById('trackedBtn');

// checks if two arrays match at indices 1, 2, 3 (here: zip code, area, number of rooms)
function matches(arr1, arr2) {
    for (let i = 1; i < 4; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

// checks if elem (an array) matches one of the arrays in array (an array of arrays)
function matchesOneIn(elem, array) {
    let len = array.length;
    for (let i = 0; i < len; i++) {
        if (matches(elem, array[i])) {
            return true;
        }
    }
    return false;
}

// removes those elements from inputArray that match some other element in inputArray
function removeDuplicatesFrom(inputArray) {
    let outputArray = [];
    let len = inputArray.length;
    for (let i = 0; i < len; i++) {
        if (!matchesOneIn(inputArray[i], outputArray)) {
            outputArray.push(inputArray[i]);
        }
    }
    return outputArray;
}

// creates a date from a string of the form 'dd.mm.yyyy hh:mm Uhr'
function makeDate(dateString) {
    let subStrings = dateString.split(' '); // ['dd.mm.yyyy', 'hh:mm', 'Uhr']
    let dateStr = subStrings[0]; // 'dd.mm.yyyy'
    let timeStr = subStrings[1]; // 'hh:mm'
    let dateStrParts = dateStr.split('.'); // ['dd', 'mm', 'yyyy']
    let timeStrParts = timeStr.split(':'); // ['hh', 'mm']
    let year = dateStrParts[2];  // 'yyyy'
    let month = dateStrParts[1] - 1; // 'mm'
    let day = dateStrParts[0]; // 'dd'
    let hours = timeStrParts[0]; // 'hh'
    let minutes = timeStrParts[1]; // 'mm'
    let date = new Date(year, month, day, hours, minutes);
    return date;
}

// creates a string of the form 'dd.mm.yyyy hh:mm Uhr' from a date
function makeDateStr(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    let dateStr = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ' Uhr';
    return dateStr;
}

document.addEventListener("DOMContentLoaded", function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // checks if current page shows expose of a single apartment only
        if(tabs[0].url.indexOf('expose') > -1) {
            console.log('You are looking at an expose');
            let url = tabs[0].url;

            // hides trackedButton (perhaps use elem.classlist.add('className') or elem.classList.remove('className')?)
            trackedButton.hidden = true;

            // listens for clicks on the 'Track' button of popup
            trackButton.addEventListener('click', function() {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    // sends message to content script
                    chrome.tabs.sendMessage(tabs[0].id, {message: 'Track button clicked', url: url}, function(response) {

                        // creates a date string from the response object sent back by content script
                        let currentDateStr = response.currentDate;

                        // retrieves everything stored in chrome storage (the entire storage object)
                        chrome.storage.local.get(null, function(result) {

                            // gets the storage entry created by the current click event
                            let current = result[currentDateStr];

                            let listElem = document.createElement('ul');

                            // iterates over the properties of the result object retrieved from storage and filters
                            // out those property values (arrays) that match the array of the currently clicked item.
                            for (let date in result) {
                                if (result.hasOwnProperty(date) && matches(result[date], current)) {
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
          // checks if current page lists search results
        } else if (tabs[0].url.indexOf('liste') > -1) {
            // hides trackButton (perhaps use elem.classlist.add('className') or elem.classList.remove('className')?)
            trackButton.hidden = true;

            trackedButton.addEventListener('click', function() {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    // retrieves everything stored in chrome storage (the entire storage object)
                    chrome.storage.local.get(null, function(result) {
                        let storageResults = [];
                        for (let date in result) {
                            storageResults.push(result[date]);
                        }

                        let uniqResults = removeDuplicatesFrom(storageResults);
                        console.log('uniqResults are ' + uniqResults);

                        // creates a div for the entire list of tracked apartments
                        let listeDiv = document.getElementById('listeDiv');
                            
                        uniqResults.forEach(function(item) {

                            // creates a div for the apartment
                            let itemDiv = document.createElement('div');
                            itemDiv.classList.add('container');

                            // creates a div for the image and append it to the apartment div
                            let imgDiv = document.createElement('div');
                            let itemImage = document.createElement('img');
                            itemImage.src = item[6];
                            itemImage.alt = 'Photo of apartment';
                            imgDiv.appendChild(itemImage);
                            itemDiv.appendChild(imgDiv);
                            
                            // creates a text div for header and price
                            let txtDiv = document.createElement('div');
                            
                            // creates a header element 
                            let itemHeader = document.createElement('h3');
                            itemHeader.textContent = item[5];

                            let duplicates = [];
                            // finds the entries in storageResults that match the current item
                            storageResults.forEach(function(entry) {
                                if (matches(entry, item)) {
                                    duplicates.push(entry);
                                }
                            });
                            console.log('duplicates is: ' + duplicates);
                            console.log('duplicates[0][0] is ' + duplicates[0][0]);
                            console.log('typeof duplicates[0][0] is ' + typeof duplicates[0][0]);
                            console.log('makeDate(duplicates[0][0]) is ' + makeDate(duplicates[0][0]));
                            console.log('typeof makeDate(duplicates[0][0]) is ' + typeof makeDate(duplicates[0][0]));

                            // creates an array containing only the dates of the elements in the duplicates array
                            let datesArray = duplicates.map(function(duplicate) {
                                return makeDate(duplicate[0]);
                            });
                            console.log('datesArray is ' + datesArray);

                            // finds the latest date in datesArray
                            let latest = new Date(Math.max.apply(null, datesArray));
                            console.log('latest is ' + latest);
                            console.log('new Date(latest) is ' + new Date(latest));

                            // finds the date immediately before the latest
                            let index = datesArray.indexOf(latest);
                            let datesMinusLatestArray = datesArray.splice(index, 1);
                            let before = new Date(Math.max.apply(null, datesMinusLatestArray));
                            console.log('before is ' + before);

                            // to find the entries that correspond to these dates, we first need to
                            // convert the dates back to strings
                            let latestStr = makeDateStr(latest);
                            let beforeStr = makeDateStr(before);
                            console.log('makeDateStr(latest) is ' + makeDateStr(latest));
                            console.log('makeDateStr(before) is ' + makeDateStr(before));

                            // gets the price strings for the relevant entries
                            let latestPriceStr = result[latestStr][4];
                            let beforePriceStr = result[beforeStr][4];

                            // appends a Euro symbol to the price strings that start with a digit
                            if (!isNaN(parseInt(latestPriceStr[0], 10))) {
                                latestPriceStr += ' \u20AC';
                            }
                            if (!isNaN(parseInt(beforePriceStr[0], 10))) {
                                beforePriceStr += ' \u20AC';
                            }

                            // creates a date-price list 
                            let priceList = document.createElement('ul');
                            let htmlStr = '<li>' + beforeStr + ' -- ' + beforePriceStr + '</li>';
                            htmlStr += '<li>' + latestStr + ' -- ' + latestPriceStr + '</li>';
                            priceList.innerHTML = htmlStr;

                            // appends header and price list to text div
                            txtDiv.appendChild(itemHeader);
                            txtDiv.appendChild(priceList);

                            // appends text div to the apartment div
                            itemDiv.appendChild(txtDiv);

                            // creates a div for the buttons
                            let btnDiv = document.createElement('div');
                            
                            // creates 'Delete' button and append it to button div
                            let delBtn = document.createElement('button');
                            let delTxt = document.createTextNode('Delete');
                            delBtn.appendChild(delTxt);
                            btnDiv.appendChild(delBtn);

                            // creates event handler for 'Delete' button
                            delBtn.addEventListener('click', function() {
                                // removes all those keys from storage whose values match item
                                for (let date in result) {
                                    if (matches(result[date], item)) {
                                        chrome.storage.local.remove(date);
                                        itemDiv.style.display = 'none';
                                    }
                                }
                            });

                            //creates 'Details' button and appends it to button div
                            let dtlsBtn = document.createElement('button');
                            let dtlsTxt = document.createTextNode('Details');
                            dtlsBtn.appendChild(dtlsTxt);
                            btnDiv.appendChild(dtlsBtn);

                            // creates event handler for 'Details' button
                            dtlsBtn.addEventListener('click', function() {
                                chrome.tabs.create({active: true, url: item[7]});
                            });

                            // appends button div to apartment div
                            itemDiv.appendChild(btnDiv);

                            // appends apartment div to list div
                            listeDiv.appendChild(itemDiv);
                        });
                    });
                });
            });
        }
    });
});

