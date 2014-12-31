#!/bin/bash

# fix all codeblocks which uses --- instead of ```

file=$1

sed -i '' '
# exclude header
12,$ {
  # find and replace
  s/^---$/```/g
}
' "$file"
