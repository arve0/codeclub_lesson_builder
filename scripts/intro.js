/* eslint-env jquery, browser */
/* global relative */
/**
 * Introduction if user is new or has not visited in a month.
 */

import { introJs } from 'intro.js'
import moment from 'moment'
import i18n from './i18n.js'
import Cookie from 'js-cookie'

// event handler: tour is wanted
const yesButton = $('.intro-question .btn-success')
yesButton.click(startTour)
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

i18n.on('initialized', () => {
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
  } else {
    // check if it's been more than a month since last visit
    if (lastVisit.add(30, 'days') < now) {
      // not visited in 30 days (time to refresh)
      const questionBody = $('.intro-question .modal-body > p')
      questionBody.text(i18n.t('intro.askTour'))
      question.modal()
    }
  }
})

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
    nextLabel: i18n.t('next'),
    prevLabel: i18n.t('prev'),
    skipLabel: i18n.t('intro.skipLabel'),
    scrollToElement: false,
    doneLabel: i18n.t('intro.frontPage.doneLabel'),
    steps: [{
      element: document.querySelector('.courses'),
      intro: i18n.t('intro.frontPage.courses'),
      position: 'top'
    }, {
      element: document.querySelector('#scratch'),
      intro: i18n.t('intro.frontPage.scratch')
    }, {
      element: document.querySelector('#python'),
      intro: i18n.t('intro.frontPage.python')
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
    nextLabel: i18n.t('next'),
    prevLabel: i18n.t('prev'),
    skipLabel: i18n.t('intro.skipLabel'),
    scrollToElement: false,
    doneLabel: i18n.t('intro.lessonIndex.doneLabel'),
    steps: [{
      element: document.querySelector('h1.info'),
      intro: i18n.t('intro.lessonIndex.info')
    }, {
      element: document.querySelector('.playlists h2'),
      intro: i18n.t('intro.lessonIndex.playlists')
    }, {
      element: document.querySelector('h2.level-1'),
      intro: i18n.t('intro.lessonIndex.level1')
    }]
  })
  .start()
  .oncomplete(function () {
    // take to python page
    localStorage.setItem('tour', 'lesson')
    window.location.href = i18n.t('intro.lessonIndex.nextUrl')
  })
  .onexit(tourDone)
}

function showLessonIntro () {
  localStorage.removeItem('tour')
  introJs()
  .setOptions({
    nextLabel: i18n.t('next'),
    prevLabel: i18n.t('prev'),
    skipLabel: i18n.t('intro.skipLabel'),
    scrollToElement: false,
    doneLabel: i18n.t('intro.lesson.doneLabel'),
    steps: [{
      element: document.querySelector('.lesson-icons'),
      intro: i18n.t('intro.lesson.lessonIcons')
    }, {
      element: document.querySelector(i18n.t('intro.lesson.steps')),
      position: 'top',
      intro: i18n.t('intro.lesson.pickAWord')
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
