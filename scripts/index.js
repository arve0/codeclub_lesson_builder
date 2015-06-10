$(function(){
// page loaded

/*
 * show/hide playlist
 */
$('li.playlist').click(function(event){
  $('.' + this.id).slideToggle();
});



/*
 * tooltips
 */
$('[title]').tooltip();

});
