/*
 * # DEPENDENCIES #
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
var changed = require('metalsmith-changed');
var paths = require('metalsmith-paths');
var md = require('./markdown.js');
// get configuration variables
var config = require('./config.js');
var tools = require('./tools.js');

/*
 * # SETUP OBJECTS #
 */
// metadata
var metadataOptions = [
  // scratch lesson layout
  { pattern: '**/*.md',
    metadata: { layout: 'lesson.jade' }},
  // scratch lesson layout
  { pattern: 'scratch/**/*.md',
    metadata: { layout: 'scratch.jade' }}
];

// ignores
var ignoreOptions = [
  '**/README.md',
  'index.md',
  '*/index.md'
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
  directory: config.builderRoot + '/layouts'
};


/*
 * # EXPORT #
 * build-function which takes a callback
 */
module.exports = function build(callback, options){
  options = options || {};
  var forceBuild = options.force || false;

  // do the building
  Metalsmith(config.lessonRoot)
  .source(config.sourceFolder)
  .use(ignore(ignoreOptions))
  .clean(false) // do not delete files, allow gulp tasks in parallel
  .use(paths())
  // set layout for exercises
  .use(setMetadata(metadataOptions))
  // add relative(path) for use in layouts
  .use(relative())
  // create collections
  .use(collections(collectionOptions))
  .use(paths())
  .use(changed({
      force: forceBuild,
      extnames: {
          '.md': '.html'
      }
  }))
  // convert markdown to html
  .use(md)
  // add file.link metadata (now files are .html)
  .use(filepath())
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
};
