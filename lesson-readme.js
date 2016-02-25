const path = require('path')
const config = require('./config.js')

/**
 * Metalsmith plugin.
 * Check if lesson has README.md (instructions for teachers, etc).
 * Set link to readme at github as `readme`.
 */
module.exports = function (opts) {
  opts = opts || {}
  opts.readme = opts.readme || 'README.md'

  return function (files, metalsmith, done) {
    for (let file in files) {
      if (path.basename(file) === opts.readme) {
        // file is README
        files[file].lesson = getFirstLesson(file, files)
        continue
      }
      let readme = path.join(path.dirname(file), opts.readme)
      if (readme in files) {
        let link =  [config.repo, 'tree', 'master',
                     config.sourceFolder, readme].join('/')
        files[file].readme = readme.replace(/\.md$/, '.html')
      }
    }
    done()
  }
}

/**
 * Get first lesson in same directory
 * e.g. any .md which is not README.md
 * returns undefined if not found
 */
function getFirstLesson (file, files) {
  const basename = path.basename(file)
  const names = file.split(path.sep)
  // (?!not this).+ match anything expect "not this"
  names[names.length - 1] = `(?!${basename}).+\\.md$`
  const re = new RegExp('^' + names.join('\\' + path.sep))
  const m = Object.keys(files).filter(file => file.search(re) === 0)
  if (m[0]) {
    return m[0].replace(/\.md$/, '.html')
  }
}
