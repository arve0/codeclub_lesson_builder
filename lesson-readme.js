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
      let readme = path.join(path.dirname(file), opts.readme)
      if (readme in files) {
        let link =  [config.repo, 'tree', 'master',
                     config.sourceFolder, readme].join('/')
        files[file].readme = link
      }
    }
    done()
  }
}
