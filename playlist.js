var fs = require('fs');
var path = require('path');
var yaml = require('yaml-front-matter');
var _ = require('lodash');

/*
 * export
 */
module.exports = function(collectionRoot, playlistFolder){
  // return playlists found in collectionRoot/playlistFolder
  var playlistRoot = path.join(collectionRoot, playlistFolder);

  if (!fs.existsSync(playlistRoot)) {
    return [];
  }

  // create a list of playlists
  var playlistFiles = fs.readdirSync(playlistRoot);
  playlistFiles = _.map(playlistFiles, withPath, {root: playlistRoot});
  playlistFiles = _.filter(playlistFiles, isPlaylist);

  var playlists = _.map(playlistFiles, getPlaylist, {root: collectionRoot});

  return playlists;
};


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

function playlistId(name){
  // replace chars in playlist-name, so that it can be used as id or class
  var id = name.replace(/ /g, '_');
  id = id.replace(/[\,\.\-\?]/g, '');
  return id;
}

function getLink(root, filename) {
  var link = filename.replace('.md', '.html');
  link = path.relative(root, link);
  link = path.join(path.basename(root), link);
  return link;
}

function getPlaylist(filename) {
  var lessonFiles = fs.readFileSync(filename, {encoding: 'utf8'})
                      .replace(/\r/g, '')
                      .split('\n');
  lessonFiles = _.compact(lessonFiles); // omit empty lines
  lessonFiles = _.map(lessonFiles, withPath, {root: this.root});

  var playlist = {};
  playlist.name = path.basename(filename).replace('.txt', '').replace(/_/g, ' ');
  playlist.id = playlistId(playlist.name);
  playlist.lessons = _.map(lessonFiles, getFrontMatter, {root: this.root});

  return playlist;
}

function getFrontMatter(filename){
  // return front matter of file, its filename and link
  var content = fs.readFileSync(filename);

  var frontMatter = yaml.loadFront(content);
  frontMatter = _.omit(frontMatter, '__content');
  frontMatter.filename = filename;
  frontMatter.link = getLink(this.root, filename);

  return frontMatter;
}
