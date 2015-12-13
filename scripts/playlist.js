/**
 * Client side logic for playlists.
 *
 * - Show/hide playlists.
 * - Keep track of position in playlist.
 */

var Cookie = require('js-cookie');


$(function(){
// page loaded

/**
 * show/hide playlist
 */
$('.playlist > li').click(function(){
  $('.' + this.id).slideToggle();
});


/**
 * create cookie when clicking lesson in playlist
 */
$('.playlist a').click(function(event){
  event.preventDefault();
  var playlist = getPlaylist(this);
  Cookie.set('playlist', playlist);
  window.location.href = this.attributes.href.value;
})

/**
 * If cookie is set
 */
var playlist = Cookie.getJSON('playlist');
if (playlist) {
   if (indexOf(playlist.lessons, window.location.href) !== undefined) {
     // current lesson is this very page -> add navigation
     addNavigation(playlist);
   } else {
     // remove cookie, we are no longer in playlist
     Cookie.remove('playlist');
   }
}

})


/**
 * Create a playlist object from a playlist lesson link.
 */
function getPlaylist(link) {
  var parent = $(link).parent();
  var res = {};
  res.name = $('.name', parent).text();
  res.lessons = getLessons(parent);
  return res;
}

function getLessons(playlist) {
  var base = window.location.href.replace('index.html', '');
  var links = $('a', playlist);
  return $.map(links, function(elm){
    var url = base + elm.attributes.href.value;
    var name = $('> li', elm).text();
    return {url: url, name: name};
  });
}

function addNavigation(playlist) {
  var navigation = '<div class="playlist-navigation">';
  navigation += '<h1>'+ playlist.name +'</h1>';

  navigation += '<ul class="pagination">';
  navigation += '<li><a class="prev" title="Previous">&laquo;</a></li>';
  for (var i=0, l=playlist.lessons.length; i<l; ++i) {
    var lesson = playlist.lessons[i];
    navigation += '<li';
    if (window.location.href === lesson.url) {
      navigation += ' class="active"';
    }
    navigation += '><a href="'+ lesson.url +'" ';
    navigation += 'title="'+ lesson.name +'">';
    navigation += '<span>'+ (i + 1) +'</span>';
    navigation += '</a></li>';
  }
  navigation += '<li><a class="next" title="Next">&raquo;</a></li>';
  navigation += '</ul>';
  navigation += '<div class="clearfix"></div></div>';

  $('header').parent().prepend(navigation);
  $('#footer').parent().prepend(navigation);

  $('.playlist-navigation select').change(function(){
    window.location.href = this.value;
  })

  $('.playlist-navigation a').click(function(){
    var i = indexOf(playlist.lessons, window.location.href);
    if ($(this).hasClass('prev')) {
      i -= 1;
    } else if ($(this).hasClass('next')) {
      i += 1;
    } else { return }  // not next/prev button
    if (playlist.lessons[i]) {
      var url = playlist.lessons[i].url;
      Cookie.set('playlist', playlist);
      window.location.href = url;
    }
  })
}

function indexOf(lessons, current) {
  for (var i=0, l=lessons.length; i<l; ++i) {
    if (lessons[i].url === current) {
      return i;
    }
  }
}
