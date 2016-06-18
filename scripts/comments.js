/* eslint-env browser, jquery */

/**
 * Comments in pages.
 *
 * mobile:
 *   scroll -> tooltip
 *   click -> comment
 *
 * desktop:
 *   hover -> tooltip
 *   dblclik -> comment
 */

// TODO: database url from config
// const config = import '../config.js'
const server = 'http://spole.seljebu.no:3000'

// fetch comments
const page = window.location.pathname
ajax(`/comments/${encodeURIComponent(page)}`)
  .then((res) => console.log(res))
  .fail((err) => console.error(err))

/**
 * Which elements comments are enabled for.
 */
const SELECTOR = 'section > p, section > pre, li'
const REGISTERED = 'comments-registered'

if (mobileOrTablet()) {
  /**
   * Mobile
   */
  let timeout, touched
  $(SELECTOR).tooltip({
    title: 'Trykk på teksten for å kommentere.',
    trigger: 'manual'
  })
  // touchstart -> debounce -> not scrolling? -> show comment form
  $(SELECTOR).on('touchstart', function () {
    touched = this
    timeout = setTimeout(showCommentForm.bind(this), 300)
  })
  // scroll shows tooltip
  $(document).on('scroll', function () {
    if (!timeout) {
      return
    }
    clearTimeout(timeout)
    timeout = false
    hideTooltips()
    // wait for transition out (avoid race condition)
    setTimeout(() => $(touched).tooltip('show'), 200)
  })
} else {
  /**
   * Desktop
   *
   * hover -> tooltip
   * dblclik -> comment form
   */
  $(SELECTOR).tooltip({ title: 'Dobbeltklikk for å kommentere' })
  $(SELECTOR).on('dblclick', showCommentForm)
}

function showCommentForm () {
  hideTooltips()
  removeCommentContainer()

  let paragraph = this
  let comment = CommentForm(paragraph)
  let container = CommentContainer(comment)

  comment.onsuccess = (res) => {
    comment.setInnerHTML('Kommentaren er lagret.', 'success')
  }

  if (!isRegistered()) {
    let register = RegisterForm()
    container.newChild(register)
    register.onsuccess = (res) => {
      localStorage.setItem(REGISTERED, res)
      comment.setInnerHTML('Du er registrert! Du kan nå kommentere:', 'success')
      container.newChild(comment)
    }
  }
  paragraph.insertAdjacentElement('afterEnd', container)
}

/**
 * Components.
 */

function CommentContainer (child) {
  let container = document.createElement('div')
  container.className = 'collapse in'
  let close = Close(container)
  let currentChild = child
  container.well = Well([ child, close ])
  container.insertAdjacentElement('afterBegin', container.well)
  container.newChild = (newChild) => {
    try {
      container.well.replaceChild(newChild, currentChild)
    } catch (e) {
      container.well.insertAdjacentElement('afterBegin', newChild)
    }
    currentChild = newChild
  }
  container.remove = () => {
    container.parentElement.removeChild(container)
  }
  return container
}

function Well (childs) {
  let well = document.createElement('div')
  well.className = 'well'
  childs.map(c => well.insertAdjacentElement('afterBegin', c))
  return well
}

/**
 * Will remove `elm` from `elm.parentElement` on click.
 */
function Close (elm) {
  let btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'close'
  btn.innerHTML = '&times;'
  btn.onclick = () => elm.parentElement.removeChild(elm)
  return btn
}

/**
 * RegisterForm component.
 *
 * Returns an HTML element. `form.onsuccess` is called when user is registered.
 * Error handling is done by the component.
 *
 * Usage:
 * let form = RegisterForm()
 * form.onsuccess = () => { console.log('User registered successfully.') }
 */
function RegisterForm () {
  const form = document.createElement('form')

  let captcha
  form.setInnerHTML = (msg, type) => {
    form.innerHTML =
      `${msg ? Alert(msg, type) : ''}
      <p>Du må registrere deg før du kan kommentere.</p>
      <label>Navn:
        <input name="name" type="text">
      </label><br>
      ${captcha ? Captcha(captcha) : ''}
      <input class="btn" type="submit" value="Registrer">`
  }

  ajax('/captcha')
    .then((res) => {
      captcha = res
      form.setInnerHTML()
    })
    .fail((_, err) => form.setInnerHTML(`Feil med server: ${err}`))

  form.onsubmit = (event) => {
    event.preventDefault()
    let data = $(form).serialize()

    ajax('/register', { method: 'POST', data })
      .then(form.onsuccess)
      .fail(form.onerror)
  }
  form.onerror = (jqHXR, err) => {
    switch (jqHXR.status) {
      case 400:
        // schema not valid, username given?
        form.setInnerHTML('Feil med registrering. Har du fyllt inn navn?')
        break
      case 401:
        // wrong captcha, TODO mention answer?
        form.setInnerHTML(`Feil svar på "${captcha}"`)
        break
      case 409:
        // username taken, TODO mention which name
        form.setInnerHTML('Navnet er allerede i bruk.')
        break
      default:
        form.setInnerHTML(`Feil med registrering. Kode: ${jqHXR.status} Msg: ${err}`)
        break
    }
  }

  return form
}

/**
 * CommentForm component.
 *
 * Returns an HTML element. `form.onsuccess` is called when comment is stored.
 * Error handling is done by the component.
 *
 * Usage:
 * let form = CommentForm()
 * form.onsuccess = () => { console.log('User registered successfully.') }
 */
function CommentForm (paragraph) {
  const form = document.createElement('form')
  form.setInnerHTML = (msg, type) => {
    form.innerHTML =
      `${msg ? Alert(msg, type) : ''}
      <input type="hidden" name="page" value="${page}">
      <input type="hidden" name="paragraph" value="${paragraphNumber(paragraph)}">
      <input type="hidden" name="hash" value="${hashCode(paragraph)}">
      <label>Kommentar:</label>
      <textarea class="form-control" rows="3" name="comment"></textarea>
      <br>
      <input class="btn" type="submit" value="Kommenter">`
  }

  form.onsubmit = (event) => {
    event.preventDefault()
    let data = $(form).serialize()

    ajax('/comment', { method: 'POST', data })
      .then(form.onsuccess)
      .fail(form.onerror)
  }
  form.onerror = (jqHXR, err) => {
    switch (jqHXR.status) {
      case 403:
        // not registered, should NOT happend
        localStorage.removeItem(REGISTERED)
        form.setInnerHTML('Du er ikke registrert. Vennligst oppdater siden og prøv på nytt.')
        break
      case 400:
        // schema not valid
        form.setInnerHTML('Kan ikke lagre tomme kommentarer.')
        break
      default:
        form.setInnerHTML(`Feil med registrering. Kode: ${jqHXR.status} Msg: ${err}`)
        break
    }
  }

  form.setInnerHTML()
  return form
}

const Alert = (msg, type) =>
  `<div class="alert alert-${type || 'danger'}" role="alert" style="margin-right:25px">${msg}</div>`

const Captcha = (captcha) =>
  `<label>${captcha}<input name="captcha" type="text"></label><br>`

/**
 * Helper functions.
 */

const hideTooltips = () => $(SELECTOR).tooltip('hide')
const isRegistered = () => localStorage.getItem(REGISTERED) !== null
const paragraphNumber = (paragraph) => $(SELECTOR).index(paragraph)
function removeCommentContainer () {
  let container = document.querySelector('.collapse.in')
  if (container) {
    container.parentElement.removeChild(container)
  }
}
function ajax (endpoint, opts) {
  let options = Object.assign({
    xhrFields: {
      withCredentials: true
    }
  }, opts)
  return $.ajax(server + endpoint, options)
}
function hashCode (paragraph) {
  let str = paragraph.innerText
  let hash = 0
  let i, chr, len
  if (str.length === 0) {
    return hash
  }
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

/**
 * Checks if device is mobile or tablet.
 *
 * http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
 */
function mobileOrTablet () {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4))) {
    return true
  }
  return false
}
