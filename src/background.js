/*
 * Author: alexfasquel (Alexis Fasquel)
 *
 * This is the backround page of the extension. It allows among other things
 * to interact with chrome internal APIs.
 */


var lastRequestId;

// Authorizing the script when installing the extension
chrome.runtime.onInstalled.addListener(function() {

});

//chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//  if (!inProgress) {
//    for (var shortcut in localStorage) {
//      if (tab.url.substring(7, tab.url.length) == shortcut) {
//        inProgress = true;
//        chrome.tabs.update(tabId,
//                           {url: localStorage[shortcut]},
//                           function(tab) {
//                             inProgress = false;
//                           });
//      }
//    }
//  }
//});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
  return goto(details);
}, {
  urls : ["<all_urls>"]
}, ["blocking"]);

function goto(details) {
  for (var shortcut in localStorage) {
    if(details.url == shortcut && details.requestId !== lastRequestId) {
      lastRequestId = details.requestId;
      return {
        redirectUrl : localStorage[shortcut]
      };
    }
  }
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "add") {
    var short = 'http://' + request.shortcut + '/';
    if(typeof localStorage[short] != 'undefined') {
      sendResponse(true);
    } else {
      localStorage[short] = request.url;
      sendResponse(false);
    }
  }
});


