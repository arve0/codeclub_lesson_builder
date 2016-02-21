/**
 * show introduction to lesson on :hover
 */

const SELECTOR = 'a > li.lesson';
const CONTAINER = '.lessonIntro';


$(SELECTOR).hover(showIntro, hideIntro);


function showIntro () {
  const elm = $(this).parent();
  const url = elm.attr('href');
  if (!url) {
    return;
  }

  const container = $('<div />');
  container.addClass(CONTAINER.replace('.', ''));
  $('body').append(container);

  $.ajax(url)
    .then(filterIntro)
    .then(filterImgs(dirname(url)))
    .then(filterContent)
    .then(createPopover(elm));
}

/**
 * get <section class="intro"></section>
 */
function filterIntro (data) {
  // ? is ungreedy match
  var m = data.match(/<section class="intro"[\s\S]+?<\/section>/g);
  if (!m) {
    return '';
  }
  return m[0];
}

/**
 * filter img-urls: relative-path -> lesson-path + relative-path
 */
function filterImgs (dir) {
  return function (data) {
    // src="not_starting_with/slash"
    return data.replace(/src="([^\/][^"]+)"/g, 'src="'+ dir +'$1"');
  }
}

/**
 * get paragraphs and figures
 */
function filterContent (data) {
  const intro = {};
  intro.text = $(data).find('p');
  intro.img = $(data).find('figure > img');
  if (intro.text.length === 0) {
    intro.text = null;
  }
  if (intro.img.length === 0) {
    intro.img = null;
  }
  if (intro.img || intro.text) {
    return intro;
  }
}

/**
 * functional Intro element
 */
function Intro(data) {
  const elm = $('<div />');
  if (data.text) {
    elm.append('<div class="text" />')
    $('.text', elm).append(data.text);
    if (!data.img) {
      $('.text', elm).css('width', '100%');
    }
  }
  if (data.img) {
    elm.append('<div class="img" />')
    $('.img', elm).append(data.img);
    if (!data.text) {
      $('.text', elm).css('width', '100%');
    }
  }
  return elm;
}

/**
 * opens a popover with the intro
 */
let timeout;
function createPopover (elm) {
  return function (data) {
    if (!data) {
      return;
    }
    elm.popover({
      animate: true,
      container: CONTAINER,
      placement: 'bottom',
      trigger: 'manual',
      html: true,
      content: Intro(data)
    });
    // debounce
    clearTimeout(timeout);
    timeout = setTimeout(() => elm.popover('show'), 200);
  }
}

/**
 * remove all intro popovers
 */
function hideIntro () {
  $(CONTAINER).remove();
}

/**
 * /path/name.html -> /path/
 */
function dirname (url) {
  return url.replace(/\/[^\/]+$/, '/');
}
