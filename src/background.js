/*
 * Author: alexfasquel (Alexis Fasquel)
 *
 * This is the backround page of the extension. It allows among other things
 * to interact with chrome internal APIs.
 */


var inProgress = false;

// Authorizing the script when installing the extension
chrome.runtime.onInstalled.addListener(function() {

});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (!inProgress) {
    for (var shortcut in localStorage) {
      if (tab.url.substring(7, tab.url.length) == shortcut) {
        inProgress = true;
        chrome.tabs.update(tabId,
                           {url: localStorage[shortcut]},
                           function(tab) {
                             inProgress = false;
                           });
      }
    }
  }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "add") {
      var short = request.shortcut + '/';

      if(typeof localStorage[short] != 'undefined') {
        sendResponse(true);
      } else {
        localStorage[short] = request.url;
        sendResponse(false);
      }
    }
});


