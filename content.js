chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.message == "Track button clicked") {
        
        let entryValue = [];

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
        entryValue.push(dateStr);

        let locationElem = document.querySelector('.location');
        let locationStr = locationElem.querySelector('span').textContent;
        let zip = locationStr.trim().substring(0, 5);
        entryValue.push(zip);

        let areaElem = document.querySelectorAll('.hardfact')[1];
        let areaStr = areaElem.textContent;
        let area = areaStr.trim().substring(0, areaStr.indexOf(' '));
        entryValue.push(area);

        let roomsElem = document.querySelectorAll('.hardfact.rooms')[1];
        let roomsStr = roomsElem.textContent;
        let rooms = roomsStr.trim().substring(0, roomsStr.indexOf(' '));
        entryValue.push(rooms);

        let priceElem = document.querySelectorAll('.hardfact strong')[0];
        let priceStr = priceElem.textContent;
//        let price = priceStr.trim().substring(0, priceStr.indexOf(' '));

        entryValue.push(priceStr);

        
//        if (!isNaN(parseInt(price[0], 10))) {
//            entryValue.push(price + ' \u20AC');
//        } else {
//            entryValue.push('Auf Anfrage');
//        }
        
        let entry = {};
        entry[dateStr] = entryValue;

        chrome.storage.local.set(entry, function() {
            console.log('The new entry is: ' + entryValue);
        });

        sendResponse({currentDate: dateStr});
    }
});
