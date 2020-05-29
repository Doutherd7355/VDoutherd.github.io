$(document).ready(function(e){
  $win =$(window);
  $navbar = $('#header');
  $toggle = $('.toggle-button');
  var width = $navbar.width();
  toggle_onclick($win, $navbar, width);


// resize event

$win.resize(function(){
  toggle_onclick($win, $navbar, width);
});

$toggle.click(function(e){
  $navbar.toggleClass("toggle-left");
})

});

function toggle_onclick($win, $navbar, width){
  if($win.width() <= 768){
    $navbar.css({left: `-${width}px`});
  }else{
    $navbar.css({left:`0px`});
  }
}

var typed = new typed('#typed'.{
  strings:[
    'Educator',
    'Curriculum Developer',
    'Mentor',
    'Web Developer'
  ],
  typeSpeed: 50,
  backSpeed: 50,
  loop: true,
});
