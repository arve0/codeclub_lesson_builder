var Static = require('node-static');
var http = require('http');
var Spider = require('node-spider');
var assert = require('assert');
var config = require('./config.js');
var _ = require('lodash');

function length(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
}

/**
 * Export closure, so that checkLinks can be used in gulp without
 * creating an anonymous function.
 *
 * @module.exports
 * @param {string} start URL where crawler should start looking for links.
 * @return {function} checkLinks Calling checkLinks will start crawling.
 */
module.exports = function(start) {
  /**
  * checkLinks crawls all pages and check that href and src attributes does
  * have a HTTP 200 response. It checks links outside the start domain, but
  * does _not_ crawl pages outside start.
  *
  * @param {function} cb Called when all links have been checked.
  */
  return function checkLinks(cb){
    console.log('Checking all links found at ' + start);
    var webserver;

    if (start.search('http://localhost') === 0) {
      // we need to start a web server
      var files = new Static.Server(config.buildRoot);
      webserver = http.createServer(function (request, response) {
        request.addListener('end', function () {
          files.serve(request, response);
        }).resume();
      });
      webserver.listen(3000, crawl);
    } else {
      crawl();
    }
    function crawl(){
      var resources = {};  // dict of referrers {link: [referrer1, referrer2, ..], link2..}
      resources[start] = ['start'];
      var failed = [];  // list of failed links
      var ok = 0;  // number of OK links
      var broken = 0;  // number of broken links


      var opts = {
        concurrent: 5,
        done: done,
        error: error,
        headers: { 'user-agent': 'codeclub_lesson_builder' },
        timeout: 5000
      };  // spider options

      // text spider for HTML, CSS, etc
      textSpider = new Spider(opts);

      // HEAD requests on external sites and binary files
      headOpts = _.assign({}, opts);
      headOpts.method = 'HEAD';
      headSpider = new Spider(headOpts);

      // let's go! :-)
      textSpider.queue(start, parseResponse);

      /**
       * on OK link
       */
      function parseResponse(doc){
        // check status code
        var code = doc.res.statusCode;
        if (code !== 200 && this.opts.method === 'HEAD') {
          // try again with GET-method
          textSpider.queue(this.opts.url, parseResponse);
          return;
        }
        if (code !== 200) {
          process.stdout.write('x'); // give some feedback
          broken += 1;
          failed.push({u:doc.url, c:code});
          return;
        } else {
          ok += 1;
          process.stdout.write('.'); // give some feedback
        }

        // do not parse binary files
        if (!/text|css|json|xml/i.test(doc.res.headers['content-type'])) {
          return;
        }

        // only crawl links below start (not other domains)
        if (doc.url.search(start) === 0) {

          // all elements with href set
          doc.$('*[href]').each(queueUrl('href'));

          // all elements with src set
          doc.$('*[src]').each(queueUrl('src'));
        }

        /**
         * queueUrl closure
         */
        function queueUrl(type){
          return function(){
            var href = doc.$(this).attr(type);
            // do not add mailto and javascript links
            if (href.search(/^(mailto|javascript)/) === 0) {
              return;
            }
            // do not check #-link explicit
            var url = doc.resolve(href).split('#')[0];
            // already added
            if (url in resources) {
              // add referrer
              resources[url].push(doc.url);
              return;
            }
            // external sites or binaries
            if (url.search(start) !==0 ||
                url.search(/\.(jpg|png|gif|zip)$/) === 0) {
              headSpider.queue(url, parseResponse);
            } else {  // text, e.g., HTML, CSS, etc
              textSpider.queue(url, parseResponse);
            }
            // store referrer
            resources[url] = [doc.url];
          }
        }
      };


      /**
       * on broken link
       */
      function error(err, url) {
          process.stdout.write('!'); // give some feedback
          broken += 1;
          failed.push({u:url, c:err.code});
      }

      /**
       * print results and exit
       */
      function done() {
        // wait until both spiders are done
        if (textSpider.active.length !== 0 || headSpider.active.length !== 0) {
          return
        }

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
        if (webserver) {
          webserver.close();
        }
      }
    } // crawl end
  };
};
