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

chrome.webRequest.onBeforeRequest.addListener(function(details) {
  return goto(details);
}, {
  urls : ["<all_urls>"]
}, ["blocking"]);

function goto(details) {
  for (var shortcut in localStorage) {
    var short = 'http://' + shortcut + '/';
    if(details.url == short && details.requestId !== lastRequestId) {
      lastRequestId = details.requestId;
      return {
        redirectUrl : localStorage[shortcut]
      };
    }
  }
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "add") {
    if(typeof localStorage[request.shortcut] != 'undefined') {
      sendResponse(true);
    } else {
      localStorage[request.shortcut] = request.url;
      sendResponse(false);
    }
  } else if (request.action == "request") {
    sendResponse(localStorage);
  } else if (request.action == "delete") {
    delete localStorage[request.shortcut];
  }
});


