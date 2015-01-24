var fs = require('fs');
var path = require('path');
var lineReader = require('line-reader');
var yaml = require('yaml-front-matter');
var _ = require('lodash');

/*
 * helper functions
 */
function withPath(filename) {
  // add path to filename
  return path.join(this.root, filename);
}

function isPlaylist(filename) {
  // if not directory and ends with .txt
  return filename.match(/\.txt$/) &&
         !fs.statSync(filename).isDirectory();
}

function getPlaylistObject(filename) {
  var lessonFiles = fs.readFileSync(filename, {encoding: 'utf8'}).split('\n');
  lessonFiles = _.compact(lessonFiles); // omit empty lines
  lessonFiles = _.map(lessonFiles, withPath, {root: this.root});

  var playlistObject = {};
  playlistObject.name = path.basename(filename).replace('.txt', '');
  playlistObject.lessons = _.map(lessonFiles, getFrontMatter);

  return playlistObject;
}

function getFrontMatter(filename){
  // return front matter of file, its filename and link
  var content = fs.readFileSync(filename);

  var frontMatter = yaml.loadFront(content);
  frontMatter = _.omit(frontMatter, '__content');
  frontMatter.filename = filename;
  frontMatter.link = filename.replace('.md', '.html');

  return frontMatter;
}


module.exports = function(root, playlistFolder){
  var playlistRoot = path.join(root, playlistFolder);

  // create a list of playlists
  var playlistFiles = fs.readdirSync(playlistRoot);
  playlistFiles = _.map(playlistFiles, withPath, {root: playlistRoot});
  playlistFiles = _.filter(playlistFiles, isPlaylist);

  var playlists = _.map(playlistFiles, getPlaylistObject, {root: root});

  return playlists;
};
