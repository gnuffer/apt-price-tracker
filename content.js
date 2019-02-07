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

    let dateStr = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ' Uhr';
    return dateStr;
}

//  checks if two arrays match at indices 1, 2, 3 (here: zip code, area, number of rooms)
function arraysMatch(arr1, arr2) {
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

function ListItemObject(index) {
    this.zip = {
        selectorStr: listItems[index].getElementsByClassName('listlocation')[0].textContent,
        getSubStr: function() {
            return this.selectorStr.trim().substring(0, 5);
        },
        getValue: function() {
            return this.getSubStr();
        }
    };
    this.area = {
        selectorStr: hardFacts[index * 3 + 1].textContent,
        getSubStr: function() {
            return this.selectorStr.substring(36, this.selectorStr.indexOf(' ', 36));
        },
        getValue: function() {
            return this.getSubStr();
        }
    };
    this.rooms = {
        selectorStr: hardFacts[index * 3 + 2].textContent,
        getSubStr: function() {
            return this.selectorStr.substring(26, this.selectorStr.indexOf(' ', 26));
        },
        getValue: function() {
            return this.getSubStr();
        }
    };
    this.price = {
        selectorStr: hardFacts[index * 3].textContent,
        getSubStr: function() {
            return this.selectorStr.substring(58, this.selectorStr.indexOf(' ', 58));
        },
        getValue: function() {
            if (!isNaN(parseInt(this.getSubStr()[0], 10))) {
                return this.getSubStr();
            } else {
                return 'Auf Anfrage';
            }
        }
    };
}

window.onload = function() {
    let searchResults = [];

    for (let i = 0; i < len; i++) {
        let listItemObject = new ListItemObject(i);

        // Uses 0 as dummy initial element to ensure that the elements of itemArray
        // lign up with the elements of the arrays in chrome storage
        let itemArray = [0];

        for (let key in listItemObject) {
            if (listItemObject.hasOwnProperty(key)) {
                itemArray.push(listItemObject[key].getValue());
            }
        }

        // pushes itemArray onto searchResults
        searchResults.push(itemArray);
    }

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
            listItems[index].style.backgroundColor = '#FF0000';
        });
    });
};

// listens for the message sent by popup.js when popup button is clicked
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.message === 'Track button clicked') {

        let url = request.url;
        console.log('The url is ' + url);
        let entryValue = [];

        // creates date string and pushes it onto entryValue array
        let dateStr = makeDateStr();
        entryValue.push(dateStr);

        let entryObject = {
            zip: {
                selectorStr: document.querySelector('.location span').textContent,
                getSubStr: function() {
                    return this.selectorStr.substring(0, 5);
                },
                getValue: function() {
                    return this.getSubStr();
                }
            },
            area: {
                selectorStr: document.querySelectorAll('.hardfact')[1].textContent,
                getSubStr: function() {
                    return this.selectorStr.substr(1, this.selectorStr.indexOf(' ') - 1);
                },
                getValue: function() {
                    return this.getSubStr();
                }
            },
            rooms: {
                selectorStr: document.querySelectorAll('.hardfact.rooms')[1].textContent,
                getSubStr: function() {
                    return this.selectorStr.trim().substr(0, this.selectorStr.trim().indexOf('\n'));
                },
                getValue: function() {
                    return this.getSubStr();
                }
            },
            price: {
                selectorStr: document.querySelectorAll('.hardfact strong')[0].textContent,
                getSubStr: function() {
                    return this.selectorStr.substr(0, this.selectorStr.indexOf(' '));
                },
                getValue: function() {
                    if (!isNaN(parseInt(this.getSubStr()[0], 10))) {
                        return this.getSubStr();
                    } else {
                        return 'Auf Anfrage';
                    }
                }
            },
            header: {
                selectorStr: document.getElementsByTagName('h1')[0].textContent,
                getValue: function() {
                    return this.selectorStr;
                }
            },
            image: {
                srcStr:  document.querySelector('div.carousel-item.activeCarouselItem img').src,
                getValue: function() {
                    return this.srcStr;
                }
            },
            url: {
                urlStr: url,
                getValue: function() {
                    return this.urlStr;
                }
            }
        };

        for (let key in entryObject) {
            if (entryObject.hasOwnProperty(key)) {
                entryValue.push(entryObject[key].getValue());
            }
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
