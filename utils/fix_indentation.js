/**
 * fix indenting in lists / code blocks:
 * four spaces -> two spaces
 *
 * # FROM
 * + list item
 *
 *     ```c
 *         if (true) { }
 *     ```
 *
 *     More text.
 *
 * # TO
 * + list item
 *
 *   ```c
 *   if (true) { }
 *   ```
 *
 *   More text.
 */

var globby = require('globby')
var fs = require('fs')

var files = globby.sync('**/*.md')

files.forEach(fixCodeBlocks)

function fixCodeBlocks (filename) {
  var content = fs.readFileSync(filename, "utf8")
  // replace tabs with two spaces
  // content = content.replace(/\t/g, '    ')
  content = fixIndent(content)
  // remove trailing whitespace
  // content = content.replace(/ +$/mg, '')
  fs.writeFileSync(filename, content)
}

function fixIndent (str) {
  var lines = str.split("\n")
  var indentedCodeBlock = false
  var codeBlock = false
  var indentInsideCodeBlock = 0

  lines = lines.map((line, i) => {
    var removeIndent = 0
    if (line.indexOf('    ```') !== -1) {
      // toggle indented code block
      indentedCodeBlock = !indentedCodeBlock
      codeBlock = !codeBlock
      indentInsideCodeBlock = 0
    } else if (line.indexOf('```') !== -1) {
      // toggle code block
      codeBlock = !codeBlock
      indentedCodeBlock = false
      indentInsideCodeBlock = 0
    } else if (codeBlock && !indentedCodeBlock &&
               line.indexOf('    ') === 0 &&
               lines[i - 1].indexOf('```') !== -1) {
      // first line in code block is indented
      indentInsideCodeBlock = line.search(/[^ ]/) - 2
    }
    if (!codeBlock && line.indexOf('    ') === 0) {
      // indented and not code block
      removeIndent += 2
    }
    removeIndent += indentedCodeBlock ? 2 : 0
    removeIndent += indentInsideCodeBlock
    var r = new RegExp(`^ {${removeIndent}}`)

    return line.replace(r, '')
  })

  return lines.join('\n')
}