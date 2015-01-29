#!/bin/bash
# example usage:
# find nb-NO/python/codeclubUK -name [a-z]*md | xargs -L 1 insert.sh

file=$1

echo inserting to $file

sed -i '' '
# find YAML header
/^---$/ {
# read next line
  N
# find empty line
  /\n$/ {
# insert above
    i\
logo: ../../../assets/img/ccuk_logo.png\
author: Oversatt fra [Code Club UK](//codeclub.org.uk)\
license: "[Code Club World Limited Terms of Service](https://github.com/CodeClub/scratch-curriculum/blob/master/LICENSE.md)"
  }
}
' "$file"
