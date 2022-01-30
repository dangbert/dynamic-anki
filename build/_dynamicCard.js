"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * gets the html content and stripped text content of the front of the anki card.
 * https://www.geeksforgeeks.org/how-to-get-all-html-content-from-domparser-excluding-the-outer-body-tag/
 */
function getFront() {
  var orig = $("#front").html(); // eslint-disable-line
  // get just the inner html values
  var parser = new DOMParser();
  var doc = parser.parseFromString(orig, "text/html");

  var val = doc.all[0].textContent;
  //console.log("parsed val = "); console.log(val);

  // remove unwanted portions of string
  return [orig, trimContents(val)];
}

var EXCLUDE_PATTERNS = [/(\([^()]*\))/, // "(E)", "(EN)", etc
/(\[[^[\]]*\])/, // "[P]", "[PT]", etc
/(\[[^[\]]*\])/, // "[P]", "[PT]", etc
/(-&gt|->)/];

/**
 * returns provided string once any poritions matching EXCLUDE_PATTERNS are removed.
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
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = bold[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var b = _step2.value;

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

  var fontSize = 14 + Math.floor(Math.random() * 8);
  console.log("setting fontsize to " + fontSize);
  style.fontSize = fontSize + "px";
}

(async function () {
  randomFont('front');
  randomFont('back');

  var _getFront = getFront(),
      _getFront2 = _slicedToArray(_getFront, 2),
      frontHtml = _getFront2[0],
      frontText = _getFront2[1];

  var sentences = await fetchSentences(frontText);
  console.log("sentences = ");
  console.log(sentences);

  var index = Math.floor(Math.random() * sentences.length);
  var s = sentences[index];
  console.log('s =');
  console.log(s);
  if (s) {
    // eslint-disable-next-line
    $('#front').html("\n      " + formattedText(s.text, s.bold) + "\n      <br/><br/>\n      " + frontHtml + "\n    ");
  }
})();