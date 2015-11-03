#!/bin/bash
# fix all codeblocks which uses --- instead of ```
# usage: find src/ -name "*.md" -print0 | xargs -0 -L 1 fix_code_blocks.sh

file=$1

sed -i '
# exclude header
12,$ {
  # find and replace
  s/^---$/```/g
}
' "$file"
