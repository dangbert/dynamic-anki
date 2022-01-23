# anki-dynamic

A js lib that attempts to make Anki flashcards more "dynamic" by varying their content.

For example, each time a given flashcard is shown, we can replace the word (e.g. "hola") with a random sentence containing that word.

This lib interfaces with a personal API endpoint I built that returns a list of random sentences (sourced from misc ebooks) containing a desired word or phrase.

## How to use:

Add the following to the HTMl template for a given card type:

````html
<script type="text/javascript" src="https://raw.githubusercontent.com/dangbert/anki-dynamic/master/_dynamicCard.js"></script>
````

Note that the card template must have an element with `id="front"`.


## Supported Features:
* Randomly tweak the font size of each flashcard.
* Replace the contents of the front of each flashcard with a random sentence containing its content.  (When no match is found, the flashcard is left unmodified).

## Status of the project:

Supported languages for vocab sentences lookup:

* de
* en
* es
* pt

## Dev Notes:

````bash
# run unit tests:
yarn mocha
````
