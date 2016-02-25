/**
 * build searchIndex.json
 */
var Metalsmith = require('metalsmith')
var ignore = require('metalsmith-ignore')
var setMetadata = require('metalsmith-filemetadata')
var lunr = require('lunr')
require('lunr-no/lunr.stemmer.support')(lunr)
require('lunr-no')(lunr)
var metlunr = require('metalsmith-lunr')
var config = require('./config.js')
var tools = require('./tools.js')

// lunr: true on all .md files
var metadataOptions = [
  { pattern: '**/*.md',
    metadata: { lunr: true } }
]

// for is not a stopword in this context
var words = lunr.no.stopWordFilter.stopWords.elements
words.splice(words.indexOf('for'), 1)

// ignore everything except .md files
var ignoreOptions = [
  '**',
  '!**/*.md',
  '**/README.md'
]

/**
 * build-function, calls callback when done
 */
module.exports = function build (callback) {
  // do the building
  Metalsmith(config.lessonRoot)
  .source(config.sourceFolder)
  .use(ignore(ignoreOptions))
  .use(tools.removeExternal)
  .clean(false) // do not delete files, allow gulp tasks in parallel
  .use(setMetadata(metadataOptions))
  .use(metlunr({
    fields: {
      contents: 1,
      title: 10,
      tags: 20
    },
    pipelineFunctions: [
      lunr.no.trimmer,
      lunr.no.stopWordFilter,
      lunr.no.stemmer
    ]
  }))
  // remove lessons *after* we have created searchIndex.json
  .use(ignore(['**', '!searchIndex.json']))
  // put in build folder
  .destination('build')
  .build(function (err) {
    if (err) console.log(err)
    // callback when build is done
    callback(err)
  })
}
