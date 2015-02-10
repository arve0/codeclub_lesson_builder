/*
 * # DEPENDENCIES #
 */
var path = require('path');


/*
 * # CONFIGURATION VARIABLES #
 */
// paths
var lessonRoot = '..';
var buildRoot  = path.join(lessonRoot, 'build');
var builderRoot = path.basename(__dirname);
var assetRoot   = path.join(buildRoot, 'assets');
// folder names
var playlistFolder = 'spillelister';
var sourceFolder = 'src';
// collections
var collections = ['computercraft', 'python', 'scratch', 'web'];

var config = {
  assetRoot:      assetRoot,
  buildRoot:      buildRoot,
  builderRoot:    builderRoot,
  collections:    collections,
  lessonRoot:     lessonRoot,
  playlistFolder: playlistFolder,
  sourceFolder:   sourceFolder,
};

module.exports = config;
