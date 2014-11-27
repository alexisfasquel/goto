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
  var storage = chrome.storage.sync;

  if (request.action == "add") {
    storage.get(request.shortcut, function(res) {
      if(res.hasOwnProperty(request.shortcut)) {
        sendResponse(true);
      } else {
        var newShortcut = {};
        newShortcut[request.shortcut] = request.url;
        storage.set(newShortcut, function() {
          sendResponse(false);
        });
      }
    });
  } else if (request.action == "request") {
    storage.get(null, sendResponse);
    //
  } else if (request.action == "delete") {
    storage.remove(request.shortcut);
  }
});


