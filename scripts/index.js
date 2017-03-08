/* eslint-env jquery */
/**
 * Entry point for scripts.
 * Load after index.js so that click handles in index.js has priority.
 */

import './search.js'
import './intro.js'
import playlistInit from './playlist.js'
import './course-hover.js'
import './lesson-hover.js'
import i18n from './i18n.js'

let t
i18n.on('initialized', () => {
  t = i18n.getFixedT()

  /*
  * tooltips
  */
  $('[title]').tooltip()
})

$(() => {
  // page loaded

  /*
  * show/hide course info
  */
  $('h1.info').click(function () {
    $('.content').slideToggle()
    $('.infoicon').toggleClass('glyphicon-minus-sign').toggleClass('glyphicon-plus-sign')
    $('.clickformore').addClass('hide')
  })

  /**
  * toggle hints
  */
  $('toggle').click(function () {
    $('hide', this).slideToggle()
  })

  /**
  * show sections when correct answer is given
  */
  $('input[for^="test-"]').keyup(function (event) {
    const answer = this.attributes.answer.value.toLowerCase()
    const value = this.value.toLowerCase()
    if (answer === value) {
      const section = this.attributes.for.value
      $('section.' + section).slideDown()
    }
  })

  /*
  * external resources, wait for translation function
  */
  $('.playlist > a[href^="http"], .level > a[href^="http"]')
    .each(externalResourcePopover('indexjs.externalLesson', 'indexjs.continueToLesson'))

  let openExternalPopover  // global state
  function externalResourcePopover (thisIs, continueTo) {
    return function (_, elm) {
      function getContent () {
        let content = `<span><p data-i18n="html=${thisIs}">${t(thisIs)}</p>`
        content += `<a href="${elm.href}" data-i18n="html=${continueTo}">${t(continueTo)}</a></span>`
        return content
      }
      $(elm).popover({
        animate: true,
        placement: 'top',
        trigger: 'manual',
        html: 'true',
        title: () => t('indexjs.externalResource'),
        content: getContent
      })
      $(elm).click(function (event) {
        event.preventDefault()
        event.stopPropagation()
        // if other popover is open, hide it
        if (openExternalPopover && openExternalPopover !== elm) {
          $(openExternalPopover).popover('hide')
        }
        // if already open, set openExternalPopover to false
        // else, keep track of open popover
        openExternalPopover = (openExternalPopover === elm) ? false : elm
        $(elm).popover('toggle')
      })
    }
  }

  /**
   * click teacher notes in lesson index
   * hack, as link inside link is not possible
   */
  $('.lesson > .readme').click(function (event) {
    event.preventDefault()
    event.stopPropagation()
    var url = $(this).attr('href')
    if (url) {
      window.location.href = url
    }
  })

  /**
  * Init event handlers in other scripts.
  *
  * playlist click handlers are registered last to let other click handlers
  * do their thing (external popover, teacher notes)
  */
  playlistInit()
})
