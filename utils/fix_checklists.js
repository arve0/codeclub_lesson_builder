/**
 * changes lists inside ## {.check} from
 * - syntax
 * + syntax or
 * * syntax
 *
 * to
 *
 * - [ ] syntax
 */

var globby = require('globby')
var fs = require('fs')

var files = globby.sync('src/**/*.md')

files.forEach(fixChecklists)

function fixChecklists (filename) {
  var content = fs.readFileSync(filename, 'utf8')

  // section starts with #
  // every char not {
  // {.check} literally
  // any character not # (start of next section)
  // g: global - all matches
  // m: multiline match - [^#]+ matches newlines \n too
  var checkSection = /^#[^{]+\{\.check\}[^#]+/gm
  var sections = content.match(checkSection)
  if (!sections) {
    return
  }

  // line start with -, + or *
  // space
  // (?!) negative lookahead, do not match group
  // do not match [ ]
  // any char to end of line
  var listItem = /^[\-\+\*] (?!\[ \]).+$/gm
  var replacements = 0
  for (var section of sections) {
    var items = section.match(listItem)
    if (!items) {
      continue
    }
    for (var item of items) {
      content = content.replace(item, '- [ ]' + item.slice(1))
      replacements++
    }
  }

  if (!replacements) {
    return
  }

  console.log(`Replaced ${replacements} check list items in ${filename}`)

  fs.writeFileSync(filename, content)
}
