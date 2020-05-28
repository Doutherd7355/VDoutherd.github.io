$(document).ready(function(e)[
  $win = $(window);
  $navbar = $('#header');
  $toggle = $('toggle-button');
  var width = $navbar.width();

  toggle_onclick(win, $navbar, width)
]);

function toggle_onclick($win, $navbar, width){
  if ($win.width() <= 768){
    $navbar.css(left:'-200px');
  }
}
