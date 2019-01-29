// creates date string for current date
function makeDateStr() {

    let date = new Date();
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

    let dateStr = day + '.' + month + '.' + year + '   ' + hours + ':' + minutes + ' Uhr';
    return dateStr;
}
// checks if two arrays match at indices 1, 2, 3 (here: zip code, area, number of rooms)
// function arraysMatch(arr1, arr2) {
//     try {
//         if (arr1.length !== arr2.length) {
//             throw ('Arrays of unequal length cannot be compared!');
//         }
//     } catch(e) {
//         console.log(e);
//     }
//     for (let i = 1; i < 4; i++) {
//         if (arr1[i] !== arr2[i]) {
//             return false;
//         }
//     }
//     return true;
// }

//  checks if two arrays match at indices 1, 2, 3 (here: zip code, area, number of rooms)
function arraysMatch(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        throw new Error('Arrays of unequal length cannot be compared!');
    } 
    for (let i = 1; i < 4; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

// gets the items listed on the search results page
let listItems = document.getElementsByClassName('listitem clear relative js-listitem');
let len = listItems.length;

// gets the 'hard facts' (zip code, area, number of rooms, price) from the search results page
let hardFacts = document.getElementsByClassName('hardfact');

window.onload = function() {

    let searchResults = [];

    for (let i = 0; i < len; i++) {

        let listItem = listItems[i];

        // Uses 0 as dummy initial element to ensure that the elements of itemArray
        // lign up with the elements of the arrays in chrome storage
        let itemArray = [0];

        // finds zip code and pushes it onto itemArray
        let locationStr = listItem.getElementsByClassName('listlocation')[0].textContent;
        let zip = locationStr.trim().substring(0, 5); 
        itemArray.push(zip);

        // finds area and pushes it onto itemArray
        let areaStr = hardFacts[i * 3 + 1].textContent;
        let area = areaStr.substring(36, areaStr.indexOf(' ', 36));
        itemArray.push(area);

        // finds number of rooms and pushes it onto itemArray
        let roomsStr = hardFacts[i * 3 + 2].textContent;
        let rooms = roomsStr.substring(26, roomsStr.indexOf(' ', 26));
        itemArray.push(rooms);

        // finds price and pushes it onto itemArray
        let priceStr = hardFacts[i * 3].textContent;
        let price = priceStr.substring(58, priceStr.indexOf(' ', 58));

        // checks if price string starts with a digit
        if (!isNaN(parseInt(price[0], 10))) {
            itemArray.push(price);
        } else {
            itemArray.push('Auf Anfrage');
        }

        // pushes itemArray onto searchResults
        searchResults.push(itemArray);
    };

    // retrieves the entire storage object from chrome.storage
    chrome.storage.local.get(null, function(result) {


        // creates an array for the property values (arrays) of the object retrieved from chrome.storage
        let storageResults = [];

        if (result && typeof result === 'object') {
            // inspect result object retrieved from storage
            console.log('Retrieved from storage: ' + result);
            console.log('Retrieved from storage and stringified: ' + JSON.stringify(result));
            // stores the property values of the result object in the storageResults array
            for (let date in result) {
                storageResults.push(result[date]);
            }
        } else {
            throw 'Storage retrieval error';
        }

        let storageLength = storageResults.length;

        // inspect storageLength
        console.log('storageLength is ' + storageLength);
        // inspect storageResults
        console.log('The stringified storageResults are ' + JSON.stringify(storageResults));
        // inspect searchResults
        console.log('The stringified searchResults are ' + JSON.stringify(searchResults));

        // checks, for each apartment in searchResults, whether it is also in storageResults.  If so, it pushes its index onto the myItems array.
        let myItems = [];
        searchResults.forEach(function(item, itemIndex) {
            storageResults.forEach(function(elem, elemIndex) {
                if (arraysMatch(item, elem)) {
                    myItems.push(itemIndex);
                } else {
                    console.log('searchResult ' + itemIndex + ' didn\'t match storageResult ' + elemIndex);
                }
            });
        });

        // inspect myItems array
        console.log('The items in searchResults that are also in storageResults have one of the indices in ' + JSON.stringify(myItems));

        // highlights the search results with index in myItems on the search results page
        myItems.forEach(function(index) {
            listItems[index].style.backgroundColor = 'red';
        });
    });
};

// listens for the message sent by popup.js when popup button is clicked
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.message === 'Track button clicked') {

        let entryValue = [];

        // creates date string and pushes it onto entryValue array
        let dateStr = makeDateStr();
        entryValue.push(dateStr);

        // finds zip code and pushes it onto entryValue array
        let locationElem = document.querySelector('.location');
        let locationStr = locationElem.querySelector('span').textContent;
        let zip = locationStr.trim().substring(0, 5);
        entryValue.push(zip);

        // finds area and pushes it onto entryValue array
        let areaElem = document.querySelectorAll('.hardfact')[1];
        let areaStr = areaElem.textContent;
        let area = areaStr.trim().substring(0, areaStr.trim().indexOf(' '));
        entryValue.push(area);

        // finds room number and pushes it onto entryValue array
        let roomsElem = document.querySelectorAll('.hardfact.rooms')[1];
        let roomsStr = roomsElem.textContent;
        let rooms = roomsStr.trim().substring(0, roomsStr.trim().indexOf('\n'));
        entryValue.push(rooms);

        // finds price and pushes it onto entryValue array
        let priceElem = document.querySelectorAll('.hardfact strong')[0];
        let priceStr = priceElem.textContent;
        let price = priceStr.trim().substring(0, priceStr.trim().indexOf(' '));

        // checks if price string begins with a digit
        if (!isNaN(parseInt(price[0], 10))) {
            entryValue.push(price);
        } else {
            entryValue.push('Auf Anfrage');
        }

        let entry = {};
        entry[dateStr] = entryValue;

        // adds a property with key dateStr and value entryValue to the chrome storage object
        chrome.storage.local.set(entry, function() {
            console.log('The new entry is: ' + entryValue);
        });

        console.log(dateStr);

        // sends message object with current date back to popup.js
        sendResponse({currentDate: dateStr});
    }
});
