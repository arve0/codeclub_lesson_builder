/* eslint-env jquery, browser */
/* global relative */
/**
 * Introduction if user is new or has not visited in a month.
 */

import { introJs } from 'intro.js'
import moment from 'moment'
import Cookie from 'js-cookie'

// event handler: tour is wanted
$('.intro-question .btn-success').click(startTour)
$('.top-menu a.intro').click(startTour)

const question = $('.intro-question')
let tour, lastVisit
try {
  tour = localStorage.getItem('tour')
  // TODO: remove Cookie when migration to localStorage is complete
  lastVisit = localStorage.getItem('last visit') || Cookie.get('last visit')
  if (lastVisit) {
    lastVisit = moment(lastVisit)
  }
} catch (e) {
  // no support for localStorage
  // => do not show "want to take tour" every time
  console.warn('no localStorage support')
  lastVisit = moment()
}
const now = moment()

if (tour === 'front page') {
  showFrontPageIntro()
} else if (tour === 'lesson index') {
  showLessonIndexIntro()
} else if (tour === 'lesson') {
  showLessonIntro()
} else if (!lastVisit) {
  // never visited
  // ask if tour is wanted
  question.modal()
}

// update "last visit"
localStorage.setItem('last visit', now.format())

function startTour () {
  question.modal('hide')

  localStorage.setItem('entry page', window.location.href)
  if (!window.thisIsTheIndex) {
    // redirect -> start intro
    localStorage.setItem('tour', 'front page')
    window.location.href = relative('/')
  } else {
    showFrontPageIntro()
  }
}

function showFrontPageIntro () {
  localStorage.removeItem('tour')
  introJs()
    .setOptions({
      nextLabel: 'Neste',
      prevLabel: 'Forrige',
      skipLabel: "Avslutt omvisning",
      scrollToElement: false,
      doneLabel: "Fortsett omvisning på Python-siden",
      steps: [{
        element: document.querySelector('.courses'),
        intro: "Fremsiden inneholder alle kursene vi har.",
        position: 'top'
      }, {
        element: document.querySelector('#scratch'),
        intro: "<b>Scratch</b> passer for alle aldre. I Scratch er koden klosser som plasseres ved <i>dra-og-slipp</i>, som gjør det <i>meget</i> enkelt å lage <b>spill</b>.",
      }, {
        element: document.querySelector('#python'),
        intro: "<b>Python</b> er et tekstbasert språk som har en <i>enkel skrivemåte</i> med få unødige tegn. Python er et seriøst programmeringsspråk som brukes mye i <b>bedrifter, vitenskap og automatisering</b>."
      }]

    })
    .start()
    .oncomplete(function () {
      // take to python page
      localStorage.setItem('tour', 'lesson index')
      window.location.href = 'python'
    })
    .onexit(tourDone)
}

function showLessonIndexIntro () {
  localStorage.removeItem('tour')
  introJs()
    .setOptions({
      nextLabel: 'Neste',
      prevLabel: 'Forrige',
      skipLabel: "Avslutt omvisning",
      scrollToElement: false,
      doneLabel: "Fortsett omvisning på oppgave-siden \"Kuprat\"",
      steps: [{
        element: document.querySelector('h1.info'),
        intro: "Hvert programmeringsspråk har en kort introduksjon. Klikk på <span class=\"glyphicon glyphicon-plus-sign\"></span> for å vise introduksjonen."
      }, {
        element: document.querySelector('.playlists h2'),
        intro: "Oppgavesamlinger inneholder oppgaver som passer godt i lag. Klikk på <span class=\"glyphicon glyphicon-play\"></span> for å vise oppgavene."
      }, {
        element: document.querySelector('h2.level-1'),
        intro: "Oppgavene er sortert etter vanskelighetsgrad. Her er introduksjonsoppgaver, som er en god start for helt ferske kodere."
      }]
    })
    .start()
    .oncomplete(function () {
      // take to python page
      localStorage.setItem('tour', 'lesson')
      window.location.href = "kuprat/kuprat.html"
    })
    .onexit(tourDone)
}

function showLessonIntro () {
  localStorage.removeItem('tour')
  introJs()
    .setOptions({
      nextLabel: 'Neste',
      prevLabel: 'Forrige',
      skipLabel: "Avslutt omvisning",
      scrollToElement: false,
      doneLabel: "Gå tilbake til der du startet",
      steps: [{
        element: document.querySelector('.lesson-icons'),
        intro: "Nivå og programmeringsspråk vises her. Du kan også laste ned oppgaven som PDF."
      }, {
        element: document.querySelector('#steg-1-hei-verden'),
        position: 'top',
        intro: "Oppgavene består av steg med instruksjoner og kodeblokker.<br><br> Det var det! Lykke til :-)"
      }]
    })
    .start()
    .oncomplete(tourDone)
}

function tourDone () {
  const entry = localStorage.getItem('entry page')
  localStorage.removeItem('entry page')
  if (entry !== undefined && entry !== window.location.href) {
    window.location.href = entry
  }
}
