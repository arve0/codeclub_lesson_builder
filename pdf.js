var glob = require('globby');
var path = require('path');
var each = require('async-each');
var _    = require('lodash');
var PDF  = require('nodepdf-series');
var config = require('./config.js');

var concurrent = 4; // how many processes to spawn
var pdfOptions = { 'viewportSize': { 'width': 1024 } };

var pattern = [config.buildRoot + '/**/*.html',
               '!' + config.buildRoot + '/index.html',
               '!' + config.buildRoot + '/*/index.html'];

function generatePdf(done){
  var files = glob.sync(pattern);
  files = files.map(function(file){
    return 'file://' + path.resolve(file);
  });
  var chunkSize = Math.round(files.length/concurrent);
  var chunks = _.chunk(files, chunkSize);
  each(chunks, function(chunk, cb){
    PDF.render(chunk, pdfOptions, function(err){
      cb(err);
    });
  }, function(err){
    // check if all htmls are converted
    var pdfs = glob.sync(config.buildRoot + '/**/*.pdf');
    pdfs = pdfs.map(function(pdf){
      return path.resolve(pdf);
    });
    var diff = files.map(function(file){
      file = file.replace('file://', '').replace('.html', '.pdf');
      if (pdfs.indexOf(file) == -1) return file;
    });
    diff = _.compact(diff); // remove falsey values
    if (diff.length !== 0) {
      var lengthErr = new Error('Not all htmls was converted to pdf. ' +
                                'Missing pdfs:\n' + diff.join('\n'));
    }
    done(err || lengthErr);
  });
};

module.exports = generatePdf;
