/**
 * Introduction if user is new or has not visited in some time.
 */

var introjs = require('intro.js').introJs;
var moment = require('moment');
var Cookie = require('js-cookie');
var dateString = "YYYYMMDD";

window.moment = moment;
window.Cookie = Cookie;
window.intro = introjs;


var lastVisitCookie = Cookie.get('last visit');
if (lastVisitCookie) {
  var lastVisit = moment(lastVisitCookie);
  if (lastVisit.add(30, 'days') < now) {
    // not visited in 30 days
    console.log('not visited in 30 days')
  }
} else {
  // never visited
  var question = $('.intro-question');
  var yesButton = $('.intro-question .btn-success');

  yesButton.click(function(){
    question.modal('hide');
    introjs().setOptions({
      scrollToElement: false,
      doneLabel: 'Continue tour on next page',
      steps: [
        {
          element: document.querySelector('.courses'),
          intro: 'Here are all the programming languages you can learn.',
          position: 'top'
        }, {
          element: document.querySelector('#scratch'),
          intro: '<b>Scratch</b> is suitable for all ages. It consists of a simple <b>drag-and-drop</b> interface which makes creation of games <i>really</i> simple.'
        }, {
          element: document.querySelector('#python'),
          intro: '<b>Python</b> is a text based language with a <b>simple syntax</b>. Python is a serious programming language which is used alot in <b>business, science and scripting.</b>'
        }
      ]
    }).start().oncomplete(function(){
      Cookie.set('tour', 'python');
      window.location.href = 'python';
    });
  });
  question.modal();
}


// update cookie
var now = moment();
Cookie.set('last visit', now.format());

