/*
 * Author: alexfasquel (Alexis Fasquel)
 *
 * This is the backround page of the extension. It allows among other things
 * to interact with chrome internal webRequest API.
 */

var lastRequestId;
var cache = {};

// Init cache
chrome.storage.sync.get(null, function(res) {
  cache = res;
});

// Listen shortcuts changes because redirection should be done synchronously
chrome.storage.onChanged.addListener(function(object, area) {
  if(area != "sync") {
    return;
  }

  for (key in object) {
    if(object[key].newValue) {
      cache[key] = object[key].newValue;
    } else if(object[key].oldValue) {
      delete cache[key];
    }
  }
});

// Authorizing the script when installing the extension
chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({url: 'http://alexisfasquel.github.io/goto'});
});


// Listening for request and running the redirection function 'goto'
chrome.webRequest.onBeforeRequest.addListener(function(details) {
  return goto(details);
}, {
  urls : ["<all_urls>"]
}, ["blocking"]);

// This function will redirect the request to the url associated
//if a shorcut has been found.
function goto(details) {
  var urlRegex = /^http:\/\/([^\/]*)\/$/;
  var possibleShortcut = urlRegex.exec(details.url);
  if (possibleShortcut && cache[possibleShortcut[1]]) {
    return {
      redirectUrl: cache[possibleShortcut[1]]
    };
  }
}
