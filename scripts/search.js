// lunr search engine
var lunr = require('lunr')
require('lunr-no/lunr.stemmer.support.js')(lunr);
require('lunr-no')(lunr);


// for is not a stopword in this context
var words = lunr.no.stopWordFilter.stopWords.elements;
words.splice(words.indexOf('for'), 1);

// download index if not already downloaded
function downloadIndex(){
  if (global.index === undefined) {
    $.ajax(relative('searchIndex.json'))
      .done(function(data){
        if (typeof(data) === 'string') {
          // parse data if served as text string (local file)
          data = JSON.parse(data);
        }
        global.index = lunr.Index.load(data);
    });
  }
}


// download search index when focusing search input
var searchInput = $('.search input');
searchInput.on('focus', downloadIndex);


// search when typing
searchInput.on('input', function(event){
  var value = $(this).val();
  if (global.index !== undefined && value.length > 0){
    // debounce
    setTimeout(function(){
      if (value == searchInput.val()){
        $('div.search').show();
        $('.search > .results > li').remove();
        var results = global.index.search(value);
        global.res = results;
        var defers = results.slice(0, 10).map(getResult);
        defers.map(drawResult);
      }
    }, 200);
  }
  if (value.length == 0){
    $('div.search').hide();
  }
});


// draw search results
function drawResult(defer){
  defer.done(function(res){
    var html = '<li><a href="' + res.url + '">';
    html += '<h2>' + res.title + '</h2>';
    html += '<p>' + res.content + '</p>';
    html += '</a></li>';
    $('.search > .results').append(html);
  });
}


// fetches title and content of search result
function getResult(searchResult){
  var chain = $.Deferred();
  var defer = $.Deferred();

  chain.resolve(searchResult)
  .then(getPage)
  .then(removeImg)
  .then(getTitle)
  .then(getContent)
  .then(cleanContent)
  .then(defer.resolve);

  return defer.promise();
}
global.gr = getResult;

// get html of searchResult.ref
function getPage(searchResult){
  var url = searchResult.ref.replace('.md', '.html');
  searchResult.url = relative(url);
  var promise = $.ajax(searchResult.url).then(function(data){
    searchResult.html = data;
    return searchResult;
  });
  return promise;
}


// remove <img> from html string
function removeImg(searchResult){
  var html = searchResult.html;
  var img = new RegExp(/<img[^>]*>/g);
  while (html.search(img) !== -1) {
    html = html.replace(img, '');
  }
  searchResult.html = html;
  return searchResult;
}


// remove <*> from content string
function cleanContent(searchResult){
  var content = searchResult.content;
  var element = new RegExp(/<[^>]*>/g);
  while (content.search(element) !== -1) {
    content = content.replace(element, '');
  }
  searchResult.content = content;
  return searchResult;
}


// get title of html string
function getTitle(searchResult){
  var title = $(searchResult.html).next('title').text();
  // 'title | YourCodeClubName' => 'title'
  searchResult.title = title.replace(/ \| .*/, '');
  return searchResult;
}


// get title of html string
function getContent(searchResult){
  searchResult.content = $(searchResult.html).find('.content > *').text();
  return searchResult;
}
