var glob = require('glob');
var path = require('path');
var each = require('async-each');
var _    = require('lodash');
var PDF  = require('nodepdf-series');
var config = require('./config.js');

var concurrent = 4; // how many processes to spawn
var pdfOptions = { 'viewportSize': { 'width': 1024 } };

var generatePdf = function(done){
  glob(config.buildRoot + '/**/*.html', function(e, files){
    if (e) {
      done(e);
      return;
    }
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
      glob(config.buildRoot + '/**/*.pdf', function(e, pdfs){
        if (files.length != pdfs.length) {
          // .pdf -> .html so that we can compare
          pdfs = _.map(pdfs, function(filename){
            return filename.replace('.pdf', '.html');
          });
          var diff = _.difference(files, pdfs);
          var lengthErr = new Error('Not all htmls was converted to pdf. ' +
                                    'Not converted:\n' + JSON.stringify(diff));
        }
        done(err || e || lengthErr);
      });
    });
  });
};

module.exports = generatePdf;
