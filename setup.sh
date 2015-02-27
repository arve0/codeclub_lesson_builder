#!/bin/bash
# Install node packages and
# and clone arve0/example_lessons to ..
npm install
if [ $? -ne 0 ]; then # try again
  echo "Setup failed, trying one more time."
  # oooh, i'm nasty, but i think this will work out for us two
  rm -fr node_modules
  npm install
fi
cd ..
git clone --depth 1 https://github.com/arve0/example_lessons
cd -
