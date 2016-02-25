#!/bin/bash
# Install node packages and
# and clone kodeklubben/oppgaver/src to ..
sed -i "/^.*\"browser-sync\".*$/d" package.json
npm install
if [ $? -ne 0 ]; then # try again
  echo "Setup failed, trying one more time."
  # oooh, i'm nasty, but i think this will work out for us two
  rm -fr node_modules
  npm install
fi
git clone --depth 1 https://github.com/kodeklubben/oppgaver
mv oppgaver/src ..
