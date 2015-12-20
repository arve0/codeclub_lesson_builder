/*
 * # DEPENDENCIES #
 */
var path = require('path');
var globby = require('globby');

/*
 * Variables that depend on each other
 */

// paths
var lessonRoot = '..';
var buildRoot = path.join(lessonRoot, 'build');
var builderRoot = path.basename(__dirname);
var assetRoot = path.join(buildRoot, 'assets');
var sourceFolder = 'src';
var sourceRoot = path.join(lessonRoot, sourceFolder);


/**
 * Collections
 * Collections are folders which contain an index.md file.
 * This allows for redirections, e.g., empty index.html with
 * <script> window.location = "newUrl" </script>
 */
var collectionIndexPath = sourceRoot + '/*/index.md';
var collectionIndexes = globby.sync(collectionIndexPath);
var collections = collectionIndexes.map(function(value){
  // ["../src/python/index.md", ...] -> ["python", ...]
  var start = sourceRoot.length + 1;
  var length = value.indexOf('/index.md') - start;
  return value.substr(start, length);
});


/*
 * Export. Independent variables can be put here directly.
 */
var config = {
  assetRoot:      assetRoot,
  buildRoot:      buildRoot,
  builderRoot:    builderRoot,
  lessonRoot:     lessonRoot,
  // folder names
  playlistFolder: 'playlists',
  sourceFolder:   sourceFolder,
  sourceRoot:     sourceRoot,
  // collections
  collections:    collections,
  // github webhook for automatic building
  // Payload URL will be http://ghHost:ghPort/ghPath
  ghHost:         '0.0.0.0', // 0.0.0.0 listen on all interfaces
  ghPort:         3034,
  ghPath:         '/',
  ghMergeCommand:  '../deploy.sh',
  ghSecret:       'secret',
  // link crawling
  productionCrawlStart: 'http://arve0.github.io/example_lessons/',
  // level names
  levelNames: {
    1: 'Novice',
    2: 'Apprentice',
    3: 'Journeyman',
    4: 'Expert',
    5: 'Master',
    6: 'Champion'
  }
};

module.exports = config;
