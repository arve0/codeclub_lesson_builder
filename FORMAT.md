# The codeclub_lesson_builder format
This builder uses a format that is heavily based on the format used by
[Code Club UK](lesson_format). It is capable of
building lessons intended for the Code Club UK's builder, but there are some
differences. The main differences are related to meta data, and in general we
require less meta data than the UK builder.

[lesson_format]: https://github.com/codeclub/lesson_format


## src directory file structure
By default the builder will look for files in `../src` such that it can be
easily added to existing projects by cloning this repo into that project. This
way there is more focus on the lessons than on the builder it self, which is
less interesting from a contributor point of view.

This can though be changed in [top of build.js](build.js) and
[gulpfile.js](gulpfile.js).


## Markdown
We use the GitHub flavoured Markdown that pandoc understands, in particular the
format `markdown_github+header_attributes+yaml_metadata_block+inline_code_attributes`.
Pandoc's documentation covers these options and more:
http://johnmacfarlane.net/pandoc/demo/example9/pandocs-markdown.html


## YAML header
Lessons need to provide some basic meta data in the form of a
[YAML header](wp-yaml). The header should be added to the beginning of the
lesson's markdown file. `---` signify the beginning and end of the header. Note
that [lesson_format](lesson_format) uses `...` for the YAML-ending. You will
find tools for converting `...` to `---` in [utils](utils).

Example:
```
---
title: Title for this lesson
level: 1
---
```
Some attributes in the header are required, and some optional. Read on!

[wp-yaml]: http://en.wikipedia.org/wiki/YAML
[lesson_format]: https://github.com/codeclub/lesson_format

### YAML types
Data types in use are these:
- *String:* Start with character or `"`. Examples:
    - `author: Arve Seljebu`
    - `license: "[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)"`
- *Number:* Start with a integer. May use `.` for floats.
    - Example: `level: 1`
- *Bool:* `true` or `false`.
    - Example: `indexed: true`

Lists is currently not used, but is easily mistaken with markdown links which
have similar syntax.
- *List:* Start with character `[`, ends with `]`.
    - Example: `fruits: [apple, orange, banana]`

### Required attributes
- **title** (*string*) : Name of the lesson lesson.
- **level** (*number*) : Difficulty of the lesson. Positive integer.
    - 1: Intro - no skills needed
    - 2: Easy - can open editor, use few concepts
    - 3: Medium - combines several concepts
    - 4: Hard - required to be rigid and structured

### Optional attributes:
- **author** (*string with optional markdown*) : The lesson's author. If string
  starts with `[` (markdown links), use `"` to force type string
  (instead of list).
    - Example: `"[Arve Seljebu](http://arve0.github.io)"`

- **license** (*string with optional markdown*) : If another license then
  CC-BY-SA-4.0 is wanted for the content, specify this in the license tag.

- **language** (*string*) : Language the lesson is written in. Should be an
  [IETF language tag](wp-ietf) which is a combination of language
  ([ISO-639-1](wp-iso-639-1)) and region ([ISO-3166-1](wp-iso-3166-1)).
  Examples:
  - `nb-NO` is language Norwegian bokmål, region Norway.
  - `en-GB` is language English, region Great Britain.


[wp-ietf]: http://en.wikipedia.org/wiki/IETF_language_tag
[wp-iso-639-1]: http://en.wikipedia.org/wiki/ISO_639-1
[wp-iso-3166-1]: http://en.wikipedia.org/wiki/ISO_3166-1


## Using styles
Classes can be added to the generated HTML tags by using the following syntax:
`# Some header {.classname}`
Adding classes can be used to determine the appearance of the generated HTML.
It's possible to define your own classes in the [stylesheets](styles), however
we recommend using the predefined classes listed below.

### Predefined classes
Each lesson begins with an introduction,
- Mark up introduction headers `# Intro {.intro}` (always a h1)

Each lesson is broken down into steps
- Mark up steps with `# Step 1 {.activity}` (always a h1)

Each step has a series of activities, in a list.
- Before each list, use a subheader `## Activity checklist {.check}` (always a h2)

Each step can have things to optionally try.
- Use `## Things to try {.try}` (always h2)

Each step can have challenges too.
- Use `## Challenge {.challenge}` (always a h2)

A note to save:
- Use `## Save Your Project {.save}` (always a h2)

A note to test:
- Use `## Test Your Project {.flag}` (always a h2)

A tip:
- Use `## Heads up! {.tip}` (always a h2). The alias `.protip` also exists,
  for compatibility with legacy lesson_format.


## Styled code
Specify the programming language after <code>```</code> to get syntax
highlighting:

<pre>
```python
for i in range(10):
```
</pre>

### Scratchblocks

We use the [scratchblocks2](sb2) library to render scratch blocks. Scratch
blocks inside lessons must follow [the syntax set out here](sb-syntax). We use
`blocks` to denote a scratch block in markdown:

<pre>
Some paragraph

```blocks
when FLAG clicked
    move 10 steps
```

Another paragraph
</pre>

[sb2]: https://github.com/blob8108/scratchblocks2
[sb-syntax]: http://wiki.scratch.mit.edu/wiki/Block_Plugin/Syntax
