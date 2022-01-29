# anki-dynamic

A js lib that attempts to make Anki flashcards more "dynamic" by varying their content, font size, etc.  The ultimate goal being to improve learning; ideally for each review of a flashcard to not only review what you already know, but hopefully add a little bit of new knowledge / connect new ideas on top of what you learend previously.

For example, for language learning, each time a given flashcard is shown, we can replace the word (e.g. "hola") with a random sentence containing that word.

This lib interfaces with a personal API endpoint I built that returns a list of random sentences (sourced from misc ebooks) containing a desired word or phrase.

## How to use:

1. Method 1:
Download `_dynamicCard.js` from the `build/` folder and place it directly in your Anki media folder.  Then add this html to the bottom of a card template:

````html
<script type="text/javascript" src="_dynamicCard.js"></script>
````


2. Method 2: (not currently working due to a CORB issue)
~~Add the following to the HTML template for a given card type:~~

````html
<script type="text/javascript" src="https://raw.githubusercontent.com/dangbert/anki-dynamic/master/build/_dynamicCard.js"></script>
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

Note: I added el and tr but they don't currently work with this lib (probably an issue with char encoding).

## Dev Notes:

````bash
# run unit tests:
yarn mocha

# compile js file in build folder:
yarn build
````

You can also open `index.html` in your browser to simulate rendering a flashcard (for quick testing of this js lib).  But ultimately you should open Anki and view a few cards back to back (while viewing the browser dev console for errors).

#### How babel is used:

Some functions in _dynamicCard.js are exported (so they can be unit tested).  Babel is being used to compiled a version of this file without exports that will run in [most browsers](https://caniuse.com/es6).

In the future babel will be further helpful if I start using typescript for this repo.