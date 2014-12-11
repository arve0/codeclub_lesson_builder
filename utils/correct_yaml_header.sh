# converts yaml header from this:

#---
#prop: blabla
#...

# to this:

#---
#prop: blabla
#---

find . -name "*.md" -exec sed -i '' 's/^...$/---/g' {} +
