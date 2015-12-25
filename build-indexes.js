/**
 * build index files
 */
var Metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var collections = require('metalsmith-collections');
var setMetadata = require('metalsmith-filemetadata');
var filepath = require('metalsmith-filepath');
var ignore = require('metalsmith-ignore');
var relative = require('metalsmith-relative');
var define = require('metalsmith-define');
var _ = require('lodash');
var paths = require('metalsmith-paths');
var md = require('./markdown.js');
// get configuration variables
var config = require('./config.js');
var tools = require('./tools.js');
var getPlaylists = require('./playlist.js');

import i18nInit from './build-with-i18n.js';

/**
 * # SETUP OBJECTS #
 */
// metadata
var metadataOptions = [
  // front page layout
  { pattern: 'index.md',
    metadata: { layout: 'index.jade' }}
];

// ignore everything except index files
var ignoreOptions = [
  '**',
  '!**/*.md',
  '**/README.md'
];

// collections
var collectionOptions = {};
config.collections.forEach(function(collection){
  // options for collections
  collectionOptions[collection] = {
    pattern: collection + '/**/*.md'
  };
});

// defines available in layout
var defineOptions = {
  markdown: md.parser,
  _: _,
  config: config,
  isFile: tools.isFile,
  matter: tools.frontmatter
};

// layout
var layoutOptions = {
  engine: 'jade',
  directory: config.builderRoot + '/layouts',
  default: 'lesson-index.jade'
};


/**
 * # EXPORT #
 * build-function, calls callback when done
 */
module.exports = function build(callback){

  function buildWithI18n(i18n_t) {
  // read playlists upon every build
  var playlists = {};
  config.collections.forEach(function(collection){
    // playlists
    var collectionFolder = [config.lessonRoot, config.sourceFolder, collection].join("/");
    playlists[collection] = getPlaylists(collectionFolder);
  });
  // make it available in layout
  defineOptions.playlists = playlists;
  defineOptions.i18n_t = i18n_t;

  // do the building
  Metalsmith(config.lessonRoot)
  .source(config.sourceFolder)
  .clean(false) // do not delete files, allow gulp tasks in parallel
  .use(ignore(ignoreOptions))
  .use(ignoreIndexedFalse)
  .use(paths())
  // set layout for exercises
  .use(setMetadata(metadataOptions))
  // add relative(path) for use in layouts
  .use(relative())
  // create collections for index
  .use(collections(collectionOptions))
  .use(paths())
  // add file.link metadata (files are .md here)
  .use(filepath())
  // remove lessons *after* we have necessary metadata
  .use(ignore(['**', '!**/index.md']))
  .use(tools.removeExternal)
  // convert markdown to html
  .use(md)
  // globals for use in layouts
  .use(define(defineOptions))
  // apply layouts
  .use(layouts(layoutOptions))
  //build
  .destination('build')
  .build(function(err){
    if (err) console.log(err);
    // callback when build is done
    callback(err);
  });
}

i18nInit(buildWithI18n);
};

/**
 * remove files from build which have set indexed: false in frontmatter
 */
function ignoreIndexedFalse(files, _, done) {
  Object.keys(files).forEach(function(key){
    var file = files[key];
    if (file.indexed === false) {
      delete files[key];
    }
  });
  done();
}
