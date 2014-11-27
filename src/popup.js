var syncStorage = chrome.storage.sync;

var template = {};

template['empty-item'] = "<p class=\"empty-list\">No shortcut has been registered yet.</p>\n";

template['goto-item'] = "<li class=\"to-line\">\n" +
   "  <p class=\"shortcut\">{shortcut}</p>\n" +
   "  <img class=\"icon-to\" src=\"../icons/to.svg\"/>\n" +
   "  <p class=\"url\">{url}</p>\n" +
   "  <img class=\"icon-delete\" src=\"../icons/delete.svg\" shortcut=\"{shortcut}\"/>\n" +
   "</li>\n";

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
  for(var item in res) {
    var element = template['goto-item'].replace(/{shortcut}/g, item);
    element = element.replace(/{url}/g, res[item]);
    html += element;
  }
  if (html == '') {
    html = template['empty-item'];
  }
  document.getElementById('goto-list').innerHTML = html;

  var deleters = document.getElementsByClassName('icon-delete');
  for(var i in deleters) {
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


document.getElementById('menu-new').addEventListener('click', function() {
  document.getElementById('menu-manage').setAttribute('class', '');
  document.getElementById('wrapper-manage').setAttribute('class', 'hidden');
  document.getElementById('wrapper-new').setAttribute('class', '');
  this.setAttribute('class', 'active');
});

document.getElementById('menu-manage').addEventListener('click', function() {
  document.getElementById('menu-new').setAttribute('class', '');
  document.getElementById('wrapper-new').setAttribute('class', 'hidden');
  document.getElementById('wrapper-manage').setAttribute('class', '');
  this.setAttribute('class', 'active');
});
