$(function(){
// page loaded

/*
 * show/hide playlist
 */
$('li.playlist').click(function(){
  $('.' + this.id).slideToggle();
});


/*
 * show/hide course info
 */
$('h1.info').click(function(){
  console.log('clicked me');
  $('.content').slideToggle();
});

/*
 * tooltips
 */
$('[title]').tooltip();

});
