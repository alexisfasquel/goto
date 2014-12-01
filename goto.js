var buttons = document.getElementsByTagName('button');
  for(var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    window.location = "https://chrome.google.com/webstore/detail/goto/pljepflhkcffielbfnbbmhhfpekpcjmf";
  })
}


var lastTop = 0;
var MARGIN_MAX = 60;
var currentMargin = 50;
var MARGIN_MIN = 10;

window.onresize = function () {
  document.getElementById('magic-row').removeAttribute('style');
}

window.onscroll = function () {

  if (window.innerWidth < 600) {
    console.log('test');
    return;
  }

  // Computing scrolling deplacement
  var deplacement = this.pageYOffset - lastTop ;
  lastTop = this.pageYOffset;

  if(deplacement < 0 && this.pageYOffset > 1000) {
    return;
  }

  // Changing the margin
  currentMargin -= deplacement/15;

  // Making sure it does not overflow
  if (currentMargin > MARGIN_MAX) {
    currentMargin = MARGIN_MAX;
  } else if (currentMargin < MARGIN_MIN) {
    currentMargin = MARGIN_MIN;
  }
  // Affect the changes
  document.getElementById('magic-row').style.paddingTop = currentMargin + 'px';
  document.getElementById('magic-row').style.paddingBottom = currentMargin + 'px';
}
