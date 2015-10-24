/*
 * # DEPENDENCIES #
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
var _ = require('lodash');
var changed = require('metalsmith-changed');
var paths = require('metalsmith-paths');
// code highlighting
var highlight = require('metalsmith-metallic');
var branch = require('metalsmith-branch');
// get configuration variables
var config = require('./config.js');
var tools = require('./tools.js');

/*
 * # SETUP OBJECTS #
 */
// metadata
var metadataOptions = [
  // template for lessons
  { pattern: '**/*.md',
    metadata: { template: 'lesson.jade' }},
  // scratch lesson template
  { pattern: 'scratch/**/*.md',
    metadata: { template: 'scratch.jade' }},
];

// ignores
var ignoreOptions = [
  '**/README.md',
  '**/index.md'
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
  // set template for exercises
  .use(setMetadata(metadataOptions))
  // add relative(path) for use in templates
  .use(relative())
  // create collections
  .use(collections(collectionOptions))
  .use(paths())
  .use(changed({
      force: forceBuild,
      extnames: {
          '.md': '.html',
      },
  }))
  // highlight code - exclude scratch code blocks
  .use(branch()
    .pattern(['**/*.md', '!scratch/**/*.md']) // no highlight on scratch blocks
    .use(highlight())
  )
  // convert to html
  .use(pandoc({
    to: 'html5',
    args: ['--section-divs', '--smart']
  }))
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
