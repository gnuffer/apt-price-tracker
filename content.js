chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.greeting == "hello") {
        let header = document.getElementsByTagName('h1')[0];
        let title = header.textContent;

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

        let entryStr = dateStr + ' -- ' + title;
        let entry = {};
        entry[dateStr] = entryStr;
        chrome.storage.local.set(entry, function() {
            console.log('The new entry is: ' + entryStr);
            sendResponse({title: title});
        });
    }
});
