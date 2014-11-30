// Import of the JS variable 'template' (generated at build timed),
// containing the HTML templates
@import "../tmp/templates.js";

var syncStorage = chrome.storage.sync;

var ERROR_USED = 'error-used';
var ERROR_EMPTY = 'error-empty';


function displayError(id) {
  document.getElementById(id).style.display = 'block';
  setTimeout(function() {
    document.getElementById(id).style.display = 'none';
  }, 2000);
}

syncStorage.get(null, function(res) {
  var html = '';
  for (var item in res) {
    var element = template['goto-item'].replace(/{shortcut}/g, item);
    element = element.replace(/{url}/g, res[item]);
    html += element;
  }
  if (html == '') {
    html = template['empty-item'];
  }
  document.getElementById('goto-list').innerHTML = html;

  var wrapper = document.getElementById('wrapper-manage');
  wrapper.style.position = 'absolute';
  wrapper.style.display = 'block';



  var items = document.getElementsByClassName('to-line');
  // The width of the url element is constant
  var urlWidth = items[0].children[2].offsetWidth;

  for(var i = 0 ; i < items.length; i++) {
    var shortcutWidth = items[i].children[0].offsetWidth;
    items[i].children[2].style.width = (urlWidth - shortcutWidth) + 'px';
  }

  wrapper.removeAttribute("style");

  var deleters = document.getElementsByClassName('icon-delete');
  for (var i in deleters) {
    deleters[i].addEventListener('click', function() {
      syncStorage.remove(this.getAttribute('shortcut'));
      var element = this.parentElement;
      var list = element.parentElement;
      list.removeChild(element);
      if (list.children.length == 0) {
        document.getElementById('goto-list').innerHTML = template['empty-item'];
      }
    });
  }
});


chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
  var activeTab = arrayOfTabs[0];
  document.getElementById('add-url').value = activeTab.url;
});


document.getElementById('add').addEventListener('click', function() {
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


window.onkeypress = function (event) {
  if (event.which == 13 || event.keyCode == 13) {
    document.getElementById('add').click();
    return false;
  }
  return true;
}


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
