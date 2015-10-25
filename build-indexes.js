/**
 * build index files
 */
var Metalsmith = require('metalsmith');
var templates = require('metalsmith-templates');
var collections = require('metalsmith-collections');
var setMetadata = require('metalsmith-filemetadata');
var filepath = require('metalsmith-filepath');
var pandoc = require('metalsmith-pandoc');
var ignore = require('metalsmith-ignore');
var relative = require('metalsmith-relative');
var define = require('metalsmith-define');
var marked = require('marked'); // for md strings in YAML header
var path = require('path');
var _ = require('lodash');
var paths = require('metalsmith-paths');
// code highlighting
var highlight = require('metalsmith-metallic');
var branch = require('metalsmith-branch');
// get configuration variables
var config = require('./config.js');
var tools = require('./tools.js');
var getPlaylists = require('./playlist.js');

/**
 * # SETUP OBJECTS #
 */
// metadata
var metadataOptions = [
  // front page template
  { pattern: 'index.md',
    metadata: { template: 'index.jade' }},
  // lesson index template
  { pattern: '*/index.md',
    metadata: { template: 'lesson-index.jade' }},
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
    pattern: collection + '/**/*.md',
  };
});

// defines available in template
var defineOptions = {
  marked: marked,
  _: _,
  config: config,
  isFile: tools.isFile,
  matter: tools.frontmatter,
};


// template
var templateOptions = {
  engine: 'jade',
  directory: config.builderRoot + '/templates',
};


/**
 * # EXPORT #
 * build-function, calls callback when done
 */
module.exports = function build(callback){
  // read playlists upon every build
  var playlists = {};
  config.collections.forEach(function(collection){
    // playlists
    var collectionFolder = [config.lessonRoot, config.sourceFolder, collection].join("/");
    playlists[collection] = getPlaylists(collectionFolder);
  });
  // make it available in template
  defineOptions.playlists = playlists;

  // do the building
  Metalsmith(config.lessonRoot)
  .source(config.sourceFolder)
  .clean(false) // do not delete files, allow gulp tasks in parallel
  .use(ignore(ignoreOptions))
  .use(ignoreIndexedFalse)
  .use(paths())
  // set template for exercises
  .use(setMetadata(metadataOptions))
  // add relative(path) for use in templates
  .use(relative())
  // create collections for index
  .use(collections(collectionOptions))
  .use(paths())
  // add file.link metadata (files are .md here)
  .use(filepath())
  // remove lessons *after* we have necessary metadata
  .use(ignore(['**', '!**/index.md']))
  // convert to html
  .use(pandoc({
    to: 'html5',
    args: ['--section-divs', '--smart']
  }))
  // globals for use in templates
  .use(define(defineOptions))
  // apply templates
  .use(templates(templateOptions))
  //build
  .destination('build')
  .build(function(err){
    if (err) console.log(err);
    // callback when build is done
    callback(err);
  });
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
