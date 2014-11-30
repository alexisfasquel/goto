/*
 * Author: alexfasquel (Alexis Fasquel)
 *
 * This is the script linked to the extension popup
 */


// Import of the JS variable 'template' (generated at build timed),
// containing the HTML templates
@import "../tmp/templates.js";

// Importing strorage
var syncStorage = chrome.storage.sync;

// The id of the differents HTML error blocks
var ERROR_USED = 'error-used';
var ERROR_EMPTY = 'error-empty';

// Function that display the correct HTML error blocks according th the ID.
function displayError(id) {
  document.getElementById(id).style.display = 'block';
  setTimeout(function() {
    document.getElementById(id).style.display = 'none';
  }, 2000);
}

// When opening the popup, we want to determine the url of the current tab
chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
  var activeTab = arrayOfTabs[0];
  document.getElementById('add-url').value = activeTab.url;
});

// When getting the different shortcuts
syncStorage.get(null, function(res) {
  // For each shortcut, we create the associated HTML item template
  var html = '';
  for (var item in res) {
    var element = template['goto-item'].replace(/{shortcut}/g, item);
    element = element.replace(/{url}/g, res[item]);
    html += element;
  }
  // If there is none, using the empty template
  if (html == '') {
    html = template['empty-item'];
  }
  document.getElementById('goto-list').innerHTML = html;

  // According to the size of the shorcut, we have to resize the HTML block of the
  // url so it displays correctly

  // So we have to display the MANAGE wrapper somewhere to get width(s)
  var wrapper = document.getElementById('wrapper-manage');
  wrapper.style.position = 'absolute';
  wrapper.style.display = 'block';

  // Getting the differents shortcuts lines
  var items = document.getElementsByClassName('to-line');

  // For each shortcut, we adapt the length of the url
  for(var i = 0 ; i < items.length; i++) {
    // The width of the url element is constant
    var urlWidth = items[0].children[2].offsetWidth;
    var shortcutWidth = items[i].children[0].offsetWidth;
    items[i].children[2].style.width = (urlWidth - shortcutWidth) + 'px';

    // And while we are at it, why not add the delete button actions?
    items[i].children[3].addEventListener('click', function() {
      // Removing from storage
      syncStorage.remove(this.getAttribute('shortcut'));
      // From HTML
      var element = this.parentElement;
      var list = element.parentElement;
      list.removeChild(element);
      // And make sure the list is not empty
      if (list.children.length == 0) {
        document.getElementById('goto-list').innerHTML = template['empty-item'];
      }
    });
  }
  // We don't want to 'see' the MANAGE wrapper anymore
  wrapper.removeAttribute("style");
});


// Listing for a new shortcut added
document.getElementById('add').addEventListener('click', function() {
  // Getting values
  var short = document.getElementById('add-shortcut').value;
  var url = document.getElementById('add-url').value;
  if (short != '' && url != '') {
    // Check if shortcut already exists
    syncStorage.get(short, function(res) {
      if (res.hasOwnProperty(short)) {
        displayError(ERROR_USED);
      } else {
        // Add new shortcut to the list
        var newShortcut = {};
        newShortcut[short] = url;
        syncStorage.set(newShortcut, function() {
          window.close();
        })
      }
    });
  } else {
    displayError(ERROR_EMPTY);
  }
});


// Lets add a keyboard shorctut for the validation (enter)
window.onkeypress = function (event) {
  if (event.which == 13 || event.keyCode == 13) {
    document.getElementById('add').click();
    return false;
  }
  return true;
}

// Click listeners to switch between MANAGE and ADD wrappers

document.getElementById('menu-new').addEventListener('click', function() {
  document.getElementById('menu-manage').setAttribute('class', '');
  document.getElementById('wrapper-manage').setAttribute('class', 'wrapper hidden');
  document.getElementById('wrapper-new').setAttribute('class', 'wrapper');
  this.setAttribute('class', 'active');
});

document.getElementById('menu-manage').addEventListener('click', function() {
  document.getElementById('menu-new').setAttribute('class', '');
  document.getElementById('wrapper-new').setAttribute('class', 'wrapper hidden');
  document.getElementById('wrapper-manage').setAttribute('class', 'wrapper');
  this.setAttribute('class', 'active');
});
