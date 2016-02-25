/* eslint-env jquery */

/**
 * show introduction to lesson on :hover
 */

const SELECTOR = '.courses > a'
const CONTAINER = '.courseIntro'

$(SELECTOR).hover(showIntro, hideIntro)

function showIntro () {
  const elm = $(this)
  const url = elm.attr('href')
  if (!url) {
    return
  }

  const container = $('<div />')
  container.addClass(CONTAINER.replace('.', ''))
  $('body').append(container)

  $.ajax(url)
    .then(filterIntro)
    .then(filterContent(elm))
    .then(createPopover(elm))
}

/**
 * get <section class="intro"></section>
 */
function filterIntro (data) {
  // ? is ungreedy match
  var m = data.match(/class="content"[\s\S]+?<\/div>/g)
  if (!m) {
    return ''
  }
  return '<div ' + m[0]
}

/**
 * get paragraphs and figures
 */
function filterContent (elm) {
  return function (data) {
    const intro = {}
    intro.text = $(data).find('> p')
    if (intro.text.length === 0) {
      return
    }
    intro.lessons = elm.find('.lessons')
    return intro
  }
}

/**
 * functional Intro element
 */
function Intro (data) {
  const elm = $('<div />')
  elm.append(data.text)
  elm.append(data.lessons)
  return elm
}

/**
 * opens a popover with the intro
 */
let timeout
function createPopover (elm) {
  return function (data) {
    if (!data) {
      return
    }
    elm.popover({
      animate: true,
      container: CONTAINER,
      placement: 'auto bottom',
      trigger: 'manual',
      html: true,
      content: Intro(data)
    })
    // debounce
    clearTimeout(timeout)
    timeout = setTimeout(() => elm.popover('show'), 200)
  }
}

/**
 * remove all intro popovers
 */
function hideIntro () {
  clearTimeout(timeout)
  $(CONTAINER).remove()
}
