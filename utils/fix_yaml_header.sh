#!/bin/bash
# fix all codeblocks which uses --- instead of ```
# usage: find src/ -name "*.md" -print0 | xargs -0 -L 1 fix_yaml_header.sh

file=$1

sed -i '' '
# include header only
1,12 {
  # find and replace
  s/^\.\.\.$/\-\-\-/g
}
' "$file"
