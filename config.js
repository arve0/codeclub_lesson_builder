/*
 * # DEPENDENCIES #
 */
var path = require('path');

/*
 * Variables that depend on each other
 */

// paths
var lessonRoot = '..';
var buildRoot  = path.join(lessonRoot, 'build');
var builderRoot = path.basename(__dirname);
var assetRoot   = path.join(buildRoot, 'assets');


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
  sourceFolder:   'src',
  // collections
  collections:    ['python', 'scratch', 'web'],
  // github webhook for automatic building
  ghHost:         '0.0.0.0',
  ghPort:         3034,
  ghPath:         '/',
  ghRepo:         'reponame',
  ghPushCommand:  'cd .. && git pull && ./deploy.sh',
  ghSecret:       'secret',
  // link crawling
  productionCrawlStart: 'http://arve0.github.io/example_lessons/'
};

module.exports = config;
