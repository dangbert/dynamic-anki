"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * gets the html content and stripped text content of a given text element (specified by id).
 * e.g. gets the text content of the front of the Anki card.
 * https://www.geeksforgeeks.org/how-to-get-all-html-content-from-domparser-excluding-the-outer-body-tag/
 */
function parseText(id) {
  var removeArticle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var orig = $("#" + id).html(); // eslint-disable-line
  // get just the inner html values
  var parser = new DOMParser();
  var doc = parser.parseFromString(orig, "text/html");

  var val = doc.all[0].textContent;
  //console.log("parsed val = "); console.log(val);

  // remove unwanted portions of string
  var res = trimContents(val);
  if (removeArticle) {
    res = stripArticle(res);
  }
  return [orig, res];
}

var EXCLUDE_PATTERNS = [/(\([^()]*\))/, // "(E)", "(EN)", etc
/(\[[^[\]]*\])/, // "[P]", "[PT]", etc
/(\[[^[\]]*\])/, // "[P]", "[PT]", etc
/(-&gt|->)/, // "->", "-&gt"
/(Replay)/];

/**
 * Returns provided string once any portions matching EXCLUDE_PATTERNS are removed.
 */
function trimContents(s) {
  s = s.trim();

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = EXCLUDE_PATTERNS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var p = _step.value;

      var regex = new RegExp(p, 'ig');
      var match = void 0;
      // eslint-disable-next-line
      while (match = regex.exec(s)) {
        var left = s.substring(0, match.index),
            right = s.substring(match.index + match[0].length + 1, s.length);
        s = left + right;
        //console.log(`left: "${left}", right: "${right}", s: "${s}"`);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return s.trim();
}

var EXCLUDE_ARTICLES = [
// spanish articles
"los", "los", "las", "las", "unos", "unos", "unas", "unas", "el", "el", "la", "la", "un", "un", "una", "una",

// portuguese articles
"os", "as", "o", "a", "um", "uma", "umas", "uns",

// english articles
"the", "a", "an",

// german articles
//   https://www.clozemaster.com/blog/german-definite-articles/
"der", "die", "das", "die", "den", "dem", "des",

// french articles
//   https://mylanguages.org/french_articles.php
"L’", // TODO: get this one to work (it isn't followed by a space)
"le", "la", "les", "un", "une", "des",

// greek articles
//  https://www.foundalis.com/lan/definart.htm
"ο", "η", "το", "του", "της", "του", "τον", "την", "το", "οι", "οι", "τα", "των", "των", "των", "τους", "τις", "τα"];

/**
 * Removes any leading grammar articles from the given text string, and returns the result.
 */
function stripArticle(s) {
  s = s.trim();

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = EXCLUDE_ARTICLES[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var art = _step2.value;

      //console.log("checking for article: " + art);
      var index = s.toLowerCase().indexOf(art.toLowerCase());
      // ensure any match is a complete word (i.e. followed by a space)
      if (index === 0 && s[art.length] === ' ') {
        //console.log('found match, index = ' + index);
        return s.substring(art.length).trim();
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return s;
}

async function fetchSentences(val) {
  //const data = await $.get('http://localhost:5000/api/tools/vocab/sentences', {phrase: val, offset: 0 });
  // eslint-disable-next-line
  var data = await $.get('https://beta.engbert.me/api/tools/vocab/sentences', { phrase: val, offset: 0 });
  console.log('api call result:');
  console.log(data);
  return data.sentences;
}

/**
 * format a sentence by bolding the desired indices.
 * based on https://github.com/dangbert/personalpedia/blob/master/react-app/src/components/ToolsApp/Vocab.tsx#L142
 */
function formattedText(text, bold) {
  var index = 0;
  var nodes = [];
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = bold[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var b = _step3.value;

      if (index < b[0]) {
        nodes.push({
          content: text.substring(index, b[0]),
          bold: false
        });
      }
      nodes.push({
        content: text.substring(b[0], b[1] + 1),
        bold: true
      });
      index = b[1] + 1;
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  if (index < text.length) {
    nodes.push({
      content: text.substring(index, text.length),
      bold: false
    });
  }

  var tmp = nodes.map(function (n) {
    return "<span>\n      " + (n.bold ? '<strong>' + n.content + '</strong>' : n.content) + "\n    </span>";
  });
  return tmp.join(''); // one combined string
}

function randomFont(id) {
  // https://www.reddit.com/6u1kvm
  //var sheet = window.document.styleSheets[0];
  //sheet.insertRule('strong { color: red; }'
  //sheet.cssRules.length);

  var elem = document.getElementById(id);
  if (!elem) return;
  var style = elem.style;
  style.fontFamily = "random_" + Math.floor(Math.random() * 36);

  var fontSize = 16 + Math.floor(Math.random() * 8);
  console.log("setting fontsize to " + fontSize);
  style.fontSize = fontSize + "px";
}

/**
 * Defines possible actions for how to handle injecting a sentence into an element.
 * TOOD: can make this enum when we start using typescript
 * https://masteringjs.io/tutorials/fundamentals/enum
 */
var InjectionAction = {
  Prepend: 'prepend',
  Append: 'append',
  Replace: 'replace'
};

/**
 * Modifies a given html element by injecting a relevant sentence to its contents (if possible).
 * @param {string} id html element ID
 * @param {string} prepend key in InjectionAction, defining how to insert the sentence.
 * @returns {void}
 */
async function injectSentences(id) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : InjectionAction.Prepend;
  var removeArticle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var $elem = $("#" + id); // eslint-disable-line

  var _parseText = parseText(id, removeArticle),
      _parseText2 = _slicedToArray(_parseText, 2),
      elemHtml = _parseText2[0],
      elemText = _parseText2[1];

  console.log('elemHtml = ');
  console.log(elemHtml);
  console.log("elemText=\"" + elemText + "\"");

  // large texts are unlikely to get a sentence match
  if (elemText.length > 35) {
    console.log('skipping sentence lookup for large text');
    return;
  }
  var sentences = await fetchSentences(elemText);
  console.log("sentences = ");
  console.log(sentences);

  var index = Math.floor(Math.random() * sentences.length);
  var s = sentences[index];
  console.log('s =');
  console.log(s);

  if (!s) return;

  var newHtml = "" + formattedText(s.text, s.bold);
  if (mode === InjectionAction.Prepend) {
    newHtml = newHtml + "<br/><br/>" + elemHtml;
  } else if (mode === InjectionAction.Append) {
    newHtml = elemHtml + "<br/><br/>" + newHtml;
  }

  $elem.html(newHtml); // eslint-disable-line
}

function elementExists(id) {
  var $elem = $("#" + id); // eslint-disable-line
  return $elem.length > 0;
}

(async function () {
  randomFont('front');
  randomFont('back');

  if (elementExists('back')) {
    // TODO: prevent duplicate search of front once card is flipped
    //  (perhaps cache the front contents in a hidden element)
    injectSentences('back', InjectionAction.Append);

    // needed for front to still have a sentence
    //   (changes get reset when card is flipped)
    injectSentences('front', InjectionAction.Prepend);
  } else {
    injectSentences('front', InjectionAction.Prepend);
  }
})();