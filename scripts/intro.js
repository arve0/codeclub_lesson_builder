/**
 * Introduction if user is new or has not visited in a month.
 */

var introjs = require('intro.js').introJs;
var moment = require('moment');
var Cookie = require('js-cookie');

window.moment = moment;
window.Cookie = Cookie;
window.introjs = introjs;


// event handler: tour is wanted
var yesButton = $('.intro-question .btn-success');
yesButton.click(startTour);
$('.top-menu a.intro').click(startTour);


var question = $('.intro-question');
var tourCookie = Cookie.get('tour');
var lastVisitCookie = Cookie.get('last visit');
var now = moment();

if (tourCookie === 'front page') {
  showFrontPageIntro();
} else if (tourCookie === 'lesson index'){
  showLessonIndexIntro();
} else if (tourCookie === 'lesson'){
  showLessonIntro();
} else if (!lastVisitCookie) {
  // never visited
  // ask if tour is wanted
  question.modal();
} else {
  // check if it's been more than a month since last visit
  var lastVisit = moment(lastVisitCookie);
  if (lastVisit.add(30, 'days') < now) {
    // not visited in 30 days (time to refresh)
    var questionBody = $('.intro-question .modal-body > p');
    questionBody.text("Seems like it's a while since you've been here. Would you like a tour?");
    question.modal();
  }
}


// update "last visit"-cookie, keep for a year
Cookie.set('last visit', now.format(), {expires: 365});


function startTour() {
  question.modal('hide');

  Cookie.set('entry page', window.location.href);
  if (!window.thisIsTheIndex) {
    // redirect -> start intro
    Cookie.set('tour', 'front page');
    window.location.href = relative('/');
    return;
  } else {
    showFrontPageIntro();
  }
}


function showFrontPageIntro(){
  Cookie.remove('tour');
  introjs()
    .setOptions({
      skipLabel: 'Exit tour',
      scrollToElement: false,
      doneLabel: 'Continue tour in Python page',
      steps: [{
            element: document.querySelector('.courses'),
            intro: 'The front page contains all the programming languages you can learn.',
            position: 'top'
          }, {
            element: document.querySelector('#scratch'),
            intro: '<b>Scratch</b> is suitable for all ages. It consists of a simple <b>drag-and-drop</b> interface which makes creation of games <i>really</i> simple.'
          }, {
            element: document.querySelector('#python'),
            intro: '<b>Python</b> is a text based language with a <i>simple</i> syntax. Python is a serious programming language which is used alot in <b>business, science and scripting.</b>'
          }]

    })
    .start()
    .oncomplete(function(){
      // take to python page
      Cookie.set('tour', 'lesson index');
      window.location.href = 'python';
    })
    .onexit(tourDone);
}


function showLessonIndexIntro(){
  Cookie.remove('tour');
  introjs()
    .setOptions({
      skipLabel: 'Exit tour',
      scrollToElement: false,
      doneLabel: 'Continue tour in Hangman lesson',
      steps: [{
            element: document.querySelector('h1.info'),
            intro: 'Every programming language has a short introduction. Click <span class="glyphicon glyphicon-info-sign"></span> to reveal the introduction.',
          }, {
            element: document.querySelector('h2.level-1'),
            intro: 'Lessons are sorted in degree of difficulty. Here are the introduction lessons, which should be a good start for everyone.'
          }]
    })
    .start()
    .oncomplete(function(){
      // take to python page
      Cookie.set('tour', 'lesson');
      window.location.href = 'lessons/Hangman/Hangman.html';
    })
    .onexit(tourDone);
}


function showLessonIntro(){
  Cookie.remove('tour');
  introjs()
    .setOptions({
      skipLabel: 'Exit tour',
      scrollToElement: false,
      doneLabel: 'Go back to where you started',
      steps: [{
            element: document.querySelector('.lesson-icons'),
            intro: 'Level and programming language is shown here. You can also download the lesson as a PDF.',
          }, {
            element: document.querySelector('#step-1-pick-a-word'),
            position: 'top',
            intro: "Lessons consists of steps with instructions and code blocks.<br><br> That's it! Happy coding :-)"
          }]
    })
    .start()
    .oncomplete(tourDone);
}


function tourDone(){
  var entry = Cookie.get('entry page');
  Cookie.remove('entry page');
  if (entry !== window.location.href) {
    window.location.href = entry;
  }
}

