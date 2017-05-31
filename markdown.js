var markdownit = require('metalsmith-markdownit')
var anchor = require('markdown-it-anchor')
var attrs = require('markdown-it-attrs')
var headerSections = require('markdown-it-header-sections')
var implicitFigures = require('markdown-it-implicit-figures')
var checkbox = require('markdown-it-task-checkbox')
var hljs = require('highlight.js')

// setup markdown parser
var md = markdownit({
  html: true,  // allow html in source
  linkify: true,  // parse URL-like text to links
  langPrefix: '',  // no prefix in class for code blocks
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      // highlight supported languages
      try {
        return hljs.highlight(lang, str).value
      } catch (e) {}
    }
    if (!lang) {
      // autodetect language
      try {
        return hljs.highlightAuto(str).value
      } catch (e) {}
    }
    // do not highlight unsupported or undetected
    return ''
  }
})

md.parser
  .use(attrs)
  .use(headerSections)
  .use(implicitFigures)
  .use(anchor)
  .use(checkbox)
  .linkify.tlds('.py', false)  // linkify: turn of .py top level domain

module.exports = md
