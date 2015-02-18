#!/bin/bash

# view YAML header

#   no print    from     to     delete   print
sed -n        '/^---$/,/^---$/ {/^---$/d;p;}' "$1"
