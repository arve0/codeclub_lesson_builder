var browserSync = require('browser-sync');
var Spider = require('node-spider');
var assert = require('assert');

var buildRoot = '../build';
var start = 'http://localhost:3000/'; // crawl from here

function length(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
}

module.exports = function checkLinks(cb){
  /** crawl all pages and check links on them */
  /** will add all urls which are found in href and src attribs */
  console.log('Checking links');

  browserSync.init({
    server: { baseDir: buildRoot },
    open: false
  }, function(){
    // server ready
    var resources = {}; // dict with list of referers
    var failed = []; // list to keep links that failed
    var ok = 0;
    var broken = 0;

    // create spider
    spider = new Spider({
      concurrent: 5, logs: false,
      headers: {
        'user-agent': 'codeclub_lesson_builder'
      },
      error: function(url, err){
        broken += 1;
        failed.push({u:url, c:err});
      },
      done: function() {
        if (spider.active.length !== 0) {
          // wait for all requests to finish
          // this is fixed in node-spider#3 and can be
          // removed when fix is published to npm
          return;
        }
        // nothing more to crawl, exit
        console.log('\nLink check done');
        console.log('---------------');
        console.log('Links OK:', ok);
        console.log('Links broken:', broken);
        console.log('---------------');

        failed.forEach(function(fail){
          console.log('Code', fail.c, 'for', fail.u, 'in');
          resources[fail.u].forEach(function(ref){
            console.log(' -', ref);
          });
        });

        assert.equal(ok+broken, length(resources));

        if (broken !== 0) {
          // avoid error trace
          process.exit(1);
        } else {
          cb();
        }
        // browserSync will call process.exit -> do after cb(err)
        browserSync.exit();
      }
    });

    var reqDone = function(doc){
      /** request done, check code, crawl */
      process.stdout.write('.'); // give some feedback

      // check status code
      var code = doc.res.statusCode;
      if (code != 200) {
        broken += 1;
        failed.push({u:doc.url, c:code});
      } else {
        ok += 1;
      }

      // do not try to crawl binary files
      if (!/text|javascript|css|json|xml/i.test(doc.res.headers['content-type'])) {
        return;
      }

      // crawl links which are from localhost
      if (doc.url.search(start) === 0) {

        // all elements with href set
        doc.$('*[href]').each(function(){
          var href = this.attr('href');
          // do not check #-link explicit
          var url = doc.resolve(href).split('#')[0];
          // omit mail links
          if (url.search('mailto:') === 0) {
            return;
          }
          // already added
          if (url in resources) {
            resources[url].push(doc.url);
            return;
          }
          // ok, we're good - add it!
          spider.queue(url, reqDone);
          // keep track of referers in a list
          resources[url] = [doc.url];
        });

        // all elements with src set
        doc.$('*[src]').each(function(){
          var href = this.attr('src');
          var url = doc.resolve(href);
          // already added
          if (url in resources) {
            resources[url].push(doc.url);
            return;
          }
          spider.queue(url, reqDone);
          resources[url] = [doc.url];
        });
      }
    };

    resources[start] = ['start'];

    // let's go! :-)
    spider.queue(start, reqDone);
  });
};
