/*
 * # DEPENDENCIES #
 */
var Metalsmith = require('metalsmith')
var changed = require('metalsmith-changed')
var pdf = require('metalsmith-phantomjs-pdf')
var fs = require('fs');
var path = require('path');
// get configuration variables
var config = require('./config.js')

var ctimes = 'metalsmith-changed-ctimes-html.json';

/*
 * # EXPORT #
 * build-function which takes a callback
 */
module.exports = function build (callback) {

  // do the building
  Metalsmith(config.lessonRoot)
    .source('build')
    .clean(false) // do not delete any files
    .use(onlyLessonHTML)
    .use(changed({ ctimes: ctimes }))
    .use(deleteOldPDF)
    .use(pdf())
    .use(onlyCtimes)
    // build
    .destination('build')
    .build(callback)
}

/**
 * PDF only for files ending in .html
 */
function onlyLessonHTML (files, _, done) {
  Object.keys(files).forEach(function (file) {
    // assume index.html are only course indexes
    if (file.search(/\.html$/i) === -1 || file.search(/index\.html$/) !== -1) {
      delete files[file];
    }
  });
  done();
}

/**
 * Delete old PDF files (not depending on phantomjs overwriting)
 */
function deleteOldPDF (files, metalsmith, done) {
  Object.keys(files).forEach(function (file) {
    if (file !== ctimes) {
      var oldPDF = path.join(metalsmith.source(),
                             file.replace(/\.html$/i, '.pdf'));
      try {
        fs.unlinkSync(oldPDF);
      } catch (err) {
        if(err.code !== 'ENOENT'){
          console.error('Unable to remove PDF: ' + oldPDF);
          console.error(err);
        }
      }
    }
  });
  done();
}

/**
 * Remove HTML-files from build, such that they are not overwritten,
 * as we are only reading them to get file URLs
 */
function onlyCtimes (files, _, done) {
  Object.keys(files).forEach(function (file) {
    if (file !== ctimes) {
      delete files[file];
    }
  });
  done();
}
