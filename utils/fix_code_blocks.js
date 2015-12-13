/**
 * fixes code blocks in lists, after change from pandoc to markdown-it
 */

var globby = require("globby")
var fs = require("fs")

var files = globby.sync("src/**/*.md")

files.forEach(fixCodeBlocks)

function fixCodeBlocks(file) {
  var r = /\r\n\r\n\r\n    ```/g
  var rr = "\r\n\r\n    ```"
  var content = fs.readFileSync(file, "utf8")
  fs.writeFileSync(file, content.replace(r, rr))
}
