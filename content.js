// creates date string for current date
function getDateStr() {
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
function arraysMatch(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    } else {
        for (let i = 1; i < 4; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }
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

        // creates an array. Uses 0 as dummy first element to ensure that the
        // elements of the array lign up with the elements of the arrays in 
        // chrome storage
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

        // checks if price string starts with a number
        if (!isNaN(parseInt(price[0], 10))) {
            itemArray.push(price);
        } else {
            itemArray.push('Auf Anfrage');
        }

        // pushes itemArray onto searchResults
        searchResults.push(itemArray);
    };

    // retrieves everything stored in chrome.storage
    chrome.storage.local.get(null, function(result) {

        // inspect result object retrieved from storage
        console.log('Retrieved from storage: ' + result);
        console.log('Retrieved from storage and stringified: ' + JSON.stringify(result));

        // creates an array containing the property values (arrays) of the result object retrieved from chrome storage
        let storageResults = [];
        for (let date in result) {
            storageResults.push(result[date]);
        }

        let storageLength = storageResults.length;
        console.log('storageLength is ' + storageLength);
        // inspect storageResults
        console.log('The stringified storageResults are ' + JSON.stringify(storageResults));
        // inspect searchResults
        console.log('The stringified searchResults are ' + JSON.stringify(searchResults));

        // checks, for each item in searchResults, whether it is in storageResults.  If so, it pushes its index onto the myItems array
        let myItems = [];
        searchResults.forEach(function(item, index) {
            storageResults.forEach(function(elem, ind) {
                if (arraysMatch(item, elem)) {
                    myItems.push(index);
                } else {
                    console.log('searchResult ' + index + ' didn\'t match storageResult ' + ind);
                }
            });
        });

        // inspect myItems array
        console.log('The items in searchResults that are also in storageResults have one of the indices in the array ' + JSON.stringify(myItems));

        // highlights the divs with index in myItems on the search results page
        myItems.forEach(function(index) {
            listItems[index].style.backgroundColor = 'red';
        });
    });
};

// listens for the message sent when button on popup is clicked (see popup.js)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.message == "Track button clicked") {

        let entryValue = [];

        let dateStr = getDateStr();
        entryValue.push(dateStr);
        // let selectors = [{selector: '.location', subStr: 
        let locationElem = document.querySelector('.location');
        let locationStr = locationElem.querySelector('span').textContent;
        let zip = locationStr.trim().substring(0, 5);
        entryValue.push(zip);

        let areaElem = document.querySelectorAll('.hardfact')[1];
        let areaStr = areaElem.textContent;
        let area = areaStr.trim().substring(0, areaStr.trim().indexOf(' '));
        entryValue.push(area);

        let roomsElem = document.querySelectorAll('.hardfact.rooms')[1];
        let roomsStr = roomsElem.textContent;
        let rooms = roomsStr.trim().substring(0, roomsStr.trim().indexOf('\n'));
        entryValue.push(rooms);

        let priceElem = document.querySelectorAll('.hardfact strong')[0];
        let priceStr = priceElem.textContent;
        let price = priceStr.trim().substring(0, priceStr.trim().indexOf(' '));

        // checks if price string begins with a number character
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

        // sends message with current date back to popup.js
        sendResponse({currentDate: dateStr});
    }
});
