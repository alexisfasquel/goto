chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
  // since only one tab should be active and in the current window at once
  // the return variable should only have one entry
  var activeTab = arrayOfTabs[0];

  document.getElementById('add-url').value = activeTab.url;
});



document.getElementById('add').addEventListener('click', function(){
  var short = document.getElementById('add-shortcut').value;
  var url = document.getElementById('add-url').value;
  chrome.runtime.sendMessage({action: "add", shortcut: short, url: url}, function(error) {
    if(error) {
      document.getElementById('error').style.display = 'inline';
      setTimeout(function() {
        document.getElementById('error').style.display = 'none';
      }, 2000);
    }
  });
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
