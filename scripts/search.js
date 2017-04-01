/* eslint-env jquery, browser */
/* global relative */
// lunr search engine
var lunr = require('lunr')
require('lunr-no/lunr.stemmer.support.js')(lunr)
require('lunr-no')(lunr)

// for is not a stopword in this context
var words = lunr.no.stopWordFilter.stopWords.elements
words.splice(words.indexOf('for'), 1)

// download index if not already downloaded
function downloadIndex () {
  if (global.index === undefined) {
    $.ajax(relative('searchIndex.json'))
      .done(function (data) {
        if (typeof data === 'string') {
          // parse data if served as text string (local file)
          data = JSON.parse(data)
        }
        global.index = lunr.Index.load(data)
      })
  }
}

// download search index when focusing search input
var searchInput = $('.search input')
searchInput.on('focus', downloadIndex)

// search when typing
searchInput.on('input', handleSearchInput)

var timeout
var numberOfSearches = 0  // keep state, to avoid race conditions
function handleSearchInput (event) {
  var value = $(this).val()
  if (value.length === 0) {
    $('div.search').hide()
    numberOfSearches += 1  // do not render any waiting searches
    return
  }
  if (global.index === undefined) {
    $('.search > .results').html(`<img src="${relative('assets/img/loading.gif')}">`)
    $('div.search').show()
    // retry in 500 ms
    setTimeout(handleSearchInput.bind(this, event), 500)
    return
  }
  // give feedback
  $('.search > .results').html(`<img src="${relative('assets/img/loading.gif')}">`)
  $('div.search').show()

  // debounce, 200 ms
  clearTimeout(timeout)
  timeout = setTimeout(function () {
    if (value !== searchInput.val()) {
      return
    }

    var results = global.index.search(value)
    if (results.length === 0) {
      $('.search > .results').html('Ingenting funnet.')
      return
    }

    var defers = results.slice(0, 10).map(getResult)
    numberOfSearches += 1
    var thisSearch = numberOfSearches
    wait(defers, function (pages) {
      if (thisSearch !== numberOfSearches) {
        return  // avoid race conditions
      }
      var elms = pages.map(SearchEntry)
      $('.search > .results').html(elms.join(''))
    })
  }, 200)
}

// draw search results
function SearchEntry (res) {
  var html = '<li><a href="' + res.url + '">'
  html += '<h2>' + res.title + '</h2>'
  html += '<p>' + res.content + '</p>'
  html += '</a></li>'
  return html
}

// fetches title and content of search result
function getResult (searchResult) {
  var chain = $.Deferred()
  var defer = $.Deferred()

  chain.resolve(searchResult)
    .then(getPage)
    .then(removeImg)
    .then(getTitle)
    .then(getContent)
    .then(cleanContent)
    .then(defer.resolve)

  return defer.promise()
}

// get html of searchResult.ref
function getPage (searchResult) {
  var url = searchResult.ref.replace('.md', '.html')
  searchResult.url = relative(url)
  var promise = $.ajax(searchResult.url).then(function (data) {
    searchResult.html = data
    return searchResult
  })
  return promise
}

// remove <img> from html string
function removeImg (searchResult) {
  var html = searchResult.html
  var img = new RegExp(/<img[^>]*>/g)
  while (html.search(img) !== -1) {
    html = html.replace(img, '')
  }
  searchResult.html = html
  return searchResult
}

// remove <*> from content string
function cleanContent (searchResult) {
  var content = searchResult.content
  var element = new RegExp(/<[^>]*>/g)
  while (content.search(element) !== -1) {
    content = content.replace(element, '')
  }
  searchResult.content = content
  return searchResult
}

// get title of html string
function getTitle (searchResult) {
  var title = $(searchResult.html).next('title').text()
  // 'title | YourCodeClubName' => 'title'
  searchResult.title = title.replace(/ \| .*/, '')
  return searchResult
}

// get title of html string
function getContent (searchResult) {
  searchResult.content = $(searchResult.html).find('.content > *').text()
  return searchResult
}

/**
 * Takes an array of defers and waits until all are done.
 * When done, `cb` is called with the results as an array.
 */
function wait (defers, cb) {
  var j = 0
  var results = []
  defers.map((defer, i) => {
    results.push(0)
    defer.done((data) => {
      results[i] = data
      j += 1
      if (j === defers.length) {
        cb(results)
      }
    })
  })
}
