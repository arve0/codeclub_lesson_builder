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
    questionBody.text("Ser ut som du ikke har vært innom på en stund, vil du ha en omvisning?");
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
      nextLabel: 'Neste',
      prevLabel: 'Forrige',
      skipLabel: 'Avslutt omvisning',
      scrollToElement: false,
      doneLabel: 'Fortsett omvisning på Python-siden',
      steps: [{
            element: document.querySelector('.courses'),
            intro: 'Fremsiden inneholder alle programeringsspråkene du kan lære deg.',
            position: 'top'
          }, {
            element: document.querySelector('#scratch'),
            intro: '<b>Scratch</b> passer for alle aldre. I Scratch er koden klosser som plasseres ved <i>dra-og-slipp</i>, som gjør det <i>meget</i> enkelt å lage <b>spill</b>.'
          }, {
            element: document.querySelector('#python'),
            intro: '<b>Python</b> er et tekstbasert språk som har en <i>enkel skrivemåte</i> med få unødige tegn. Python er et seriøst programmeringsspråk som brukes mye i <b>bedrifter, vitenskap og automatisering</b>.'
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
      nextLabel: 'Neste',
      prevLabel: 'Forrige',
      skipLabel: 'Avslutt omvisning',
      scrollToElement: false,
      doneLabel: 'Fortsett omvisning på oppgave-siden "Kuprat"',
      steps: [{
            element: document.querySelector('h1.info'),
            intro: 'Hvert programmeringsspråk har en kort introduksjon. Klikk på <span class="glyphicon glyphicon-info-sign"></span> for å vise introduksjonen.',
          }, {
            element: document.querySelector('.playlists h2'),
            intro: 'Oppgavesamlinger inneholder oppgaver som passer godt i lag. Klikk på <span class="glyphicon glyphicon-play"></span> for å vise oppgavene.',
          }, {
            element: document.querySelector('h2.level-1'),
            intro: 'Oppgavene er sortert etter vanskelighetsgrad. Her er introduksjonsoppgaver, som er en god start for helt ferske kodere.'
          }]
    })
    .start()
    .oncomplete(function(){
      // take to python page
      Cookie.set('tour', 'lesson');
      window.location.href = 'kuprat/kuprat.html';
    })
    .onexit(tourDone);
}


function showLessonIntro(){
  Cookie.remove('tour');
  introjs()
    .setOptions({
      nextLabel: 'Neste',
      prevLabel: 'Forrige',
      skipLabel: 'Avslutt omvisning',
      scrollToElement: false,
      doneLabel: 'Gå tilbake til der du startet',
      steps: [{
            element: document.querySelector('.lesson-icons'),
            intro: 'Nivå og programmeringsspråk vises her. Du kan også laste ned oppgaven som PDF.',
          }, {
            element: document.querySelector('#steg-1-hei-verden'),
            position: 'top',
            intro: "Oppgavene består av steg med instruksjoner og kodeblokker.<br><br> Det var det! Lykke til :-)"
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

