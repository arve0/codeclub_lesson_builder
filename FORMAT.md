# The Codeclub Lesson Builder format
The format used by this builder is heavily based on the format used by Code Club UK. This builder is capable of building lessons intended for the Code Club UK's builder, but some functionality has been removed, and some new features have been added. The main differences between this builder and Code Club UK's builder are related meta data, there are no syntactical differences.

## Markdown
We use the GitHub flavoured Markdown that pandoc understands, in particular the format `markdown_github+header_attributes+yaml_metadata_block+inline_code_attributes`. Pandoc's documentation covers these options and more http://johnmacfarlane.net/pandoc/demo/example9/pandocs-markdown.html

## YAML header 
Lessons need to provide some basic metadata in the form of a YAML header. The header should be added to the beginning of the lesson's markdown file. The following three characters signify the beginning and end of the header: --- 

There are some required attributes in the header, and some optional. 
### Required attributes:
    title : Name of the lesson lesson. String.
    level : Difficulty of the lesson. Positive integer.
        1 - Easy
        2 - Medium
        3 - Hard

### Optional attributes:
    playlist : Used to group related lessons together. String.
    language : Language the lesson is written in. [name of language tag standard] 
    author : The lesson's author. String. 

## Using classes
Classes can be added to the generated HTML tags by using the following syntax:
`#Some text {.classname}`
Adding classes can be used to determine the appearance of the generated HTML. It's possible to define your own classes in the stylesheets, however, we recommend using the predefined classes listed below. 

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

## Scratchblocks

We use the scratchblocks2 library to render scratch blocks as png files.

Scratch blocks inside lessons must follow [the syntax set out here](http://wiki.scratch.mit.edu/wiki/Block_Plugin/Syntax).

We use `scratch` to denote a scratch block in markdown:

    Some paragraph

    ```scratch
    when FLAG clicked
        move 10 steps
    ```

    Another paragraph

