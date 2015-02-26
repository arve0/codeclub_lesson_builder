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
var playlistFolder = 'playlists';
var sourceFolder = 'src';
// collections
var collections = ['python', 'scratch', 'web'];

// github hook repo
var gitHookRepo = 'kwrl/cubestuff';

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
