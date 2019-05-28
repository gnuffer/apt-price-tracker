# Apartment Price Tracker

A Chrome extension to track the prices of houses and apartments on [immowelt.de](https://www.immowelt.de).

## Installation

1. Clone this repository.  
```
git clone https://github.com/gnuffer/apt-price-tracker
```
2. On your computer, open Chrome.
3. At the top right, click on the 3 vertical dots.
4. Select `More Tools` > `Extensions`.
5. At the top left, click on `Load unpacked`.


## Use

When viewing the expose of an item (house or apartment) on [immowelt.de](https://www.immowelt.de), clicking on the extension icon in Chrome's toolbar (to the right of the address bar) opens a popup window with a "Track" button. Clicking on the "Track" button stores the time of the click and the price at that time and displays them together with the time/price pairs stored by previous clicks. When viewing a list of search results, clicking on the extension icon opens a popup with a "Tracked" button. Clicking on the "Tracked" button shows, for each tracked item, an image of the item, its title, the times and prices stored by the two most recent clicks, and "Delete" and "Details" buttons.  The "Delete" button allows you to take the item off the list of tracked items, and the "Details" button takes you to the expose page of the item. Tracked items are highlighted on the search results page with a red background. Since the titles (descriptions) of items may change, items are identified by location (zip code), area, and room number.  
