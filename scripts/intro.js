/**
 * Introduction if user is new or has not visited in a month.
 */

import { introJs } from 'intro.js';
import moment from 'moment';
import Cookie from 'js-cookie';
import i18n from './i18n.js';


// event handler: tour is wanted
const yesButton = $('.intro-question .btn-success');
yesButton.click(startTour);
$('.top-menu a.intro').click(startTour);


const question = $('.intro-question');
const tourCookie = Cookie.get('tour');
const lastVisitCookie = Cookie.get('last visit');
const now = moment();

i18n.on('initialized', () => {
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
    const lastVisit = moment(lastVisitCookie);
    if (lastVisit.add(30, 'days') < now) {
      // not visited in 30 days (time to refresh)
      const questionBody = $('.intro-question .modal-body > p');
      questionBody.text("Seems like it's a while since you've been here. Would you like a tour?"); // FIXME: translate
      question.modal();
    }
  }
});


// update "last visit"-cookie, keep for a year
Cookie.set('last visit', now.format(), {expires: 365});


function startTour() {
  question.modal('hide');

  Cookie.set('entry page', window.location.href);
  if (!window.thisIsTheIndex) {
    // redirect -> start intro
    Cookie.set('tour', 'front page');
    window.location.href = relative('/');
  } else {
    showFrontPageIntro();
  }
}


function showFrontPageIntro(){
  Cookie.remove('tour');
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
  .oncomplete(function(){
    // take to python page
    Cookie.set('tour', 'lesson index');
    window.location.href = 'python';
  })
  .onexit(tourDone);
}


function showLessonIndexIntro(){
  Cookie.remove('tour');
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
  .oncomplete(function(){
    // take to python page
    Cookie.set('tour', 'lesson');
    window.location.href = i18n.t('intro.lessonIndex.nextUrl');
  })
  .onexit(tourDone);
}


function showLessonIntro(){
  Cookie.remove('tour');
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
      element: document.querySelector('#step-1-pick-a-word'),
      position: 'top',
      intro: i18n.t('intro.lesson.pickAWord')
    }]
  })
  .start()
  .oncomplete(tourDone);
}


function tourDone(){
  const entry = Cookie.get('entry page');
  Cookie.remove('entry page');
  if (entry !== window.location.href) {
    window.location.href = entry;
  }
}
