/*
 * # DEPENDENCIES #
 */
var Metalsmith  = require('metalsmith');
var templates   = require('metalsmith-templates');
var collections = require('metalsmith-collections');
var setMetadata = require('metalsmith-filemetadata');
var filepath    = require('metalsmith-filepath');
var pandoc      = require('metalsmith-pandoc');
var ignore      = require('metalsmith-ignore');
var relative    = require('metalsmith-relative');
var define      = require('metalsmith-define');
var marked      = require('marked'); // for md strings in YAML header
var path        = require('path');
var getPlaylists = require('./playlist');
var _           = require('lodash');
var changed     = require('metalsmith-changed');
var paths       = require('metalsmith-paths');
// code highlighting
var highlight   = require('metalsmith-code-highlight');
var branch      = require('metalsmith-branch');
// get configuration variables
var config      = require('./config.js');


/*
 * # VARIABLES #
 */
builderRoot = config.builderRoot;
lessonRoot = config.lessonRoot;
playlistFolder = config.playlistFolder;
sourceFolder = config.sourceFolder;


/*
 * # SETUP OBJECTS #
 */
// metadata
var metadataOptions = [
  // lesson template
  { pattern: path.join('*', '**', '*.md'),
    metadata: { template: 'lesson.jade' }},
  // scratch lesson template
  { pattern: path.join('scratch', '**', '*.md'),
    metadata: { template: 'scratch.jade' }},
  // front page template
  { pattern: path.join('index.md'),
    metadata: { template: 'index.jade' }},
  // lesson index template
  { pattern: path.join('*', 'index.md'),
    metadata: { template: 'lesson-index.jade' }},
];

// ignores
var ignoreOptions = [
  path.join('**', 'README.md'),
];

// collections
var collectionOptions = {};
config.collections.forEach(function(collection){
  // options for collections
  var tmp = {};
  tmp.pattern = path.join(collection, '**', '*.md');
  collectionOptions[collection] = tmp;
});

// defines available in template
var defineOptions = {
  marked: marked,
  _: _,
};

// template
var templateOptions = {
  engine: 'jade',
  directory: path.join(builderRoot, 'templates'),
};


/*
 * # EXPORT #
 * build-function which takes a callback
 */
module.exports = function build(callback, options){
  options = options || {};
  var forceBuild = options.force || false;

  // read playlists upon every build
  var playlists = {};
  config.collections.forEach(function(collection){
    // playlists
    collectionFolder = path.join(lessonRoot, sourceFolder, collection);
    playlists[collection] = getPlaylists(collectionFolder, playlistFolder);
  });
  // make it available in template
  defineOptions.playlists = playlists;

  // do the building
  Metalsmith(lessonRoot)
  .source(sourceFolder)
  .use(ignore(ignoreOptions))
  .clean(false) // do not delete files, allow gulp tasks in parallel
  .use(paths())
  // set template for exercises
  .use(setMetadata(metadataOptions))
  // add relative(path) for use in templates
  .use(relative())
  // create collections for index
  .use(collections(collectionOptions))
  // remove files not to build *after* we have set collections metadata
  .use(paths())
  .use(changed({
      force: forceBuild,
      extnames: {
          '.md': '.html',
      }
  }))
  // convert to html
  .use(pandoc({
    to: 'html5',
    args: ['--section-divs', '--smart']
  }))
  // highlight code - exclude scratch code blocks
  .use(branch()
    .pattern(['**/*.html', '!scratch/**/*.html']) // no highlight on scratch blocks
    .use(highlight({
      languages: ['java', 'python', 'lua', 'html', 'css', 'js'] // prevent bug in highlight.js < 8.5: https://github.com/isagalaev/highlight.js/issues/701
    }))
  )
  // add file.link metadata (now files are .html)
  .use(filepath())
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
