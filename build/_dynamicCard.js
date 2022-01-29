"use strict";

/**
 * get text content of front of anki card (just inner html values).
 * https://www.geeksforgeeks.org/how-to-get-all-html-content-from-domparser-excluding-the-outer-body-tag/
 */
function getFront() {
  var val = $("#front").html();
  var parser = new DOMParser();
  var doc = parser.parseFromString(val, "text/html");

  val = doc.all[0].textContent;
  //console.log("parsed val = "); console.log(val);
  return trimContents(val);
}

var EXCLUDE_PATTERNS = [/(\([^()]*\))/, // "(E)", "(EN)", etc
/(\[[^\[\]]*\])/, // "[P]", "[PT]", etc
/(\[[^\[\]]*\])/, // "[P]", "[PT]", etc
/(\-&gt|->)/];

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

      var match = void 0,
          matches = [];
      while (match = regex.exec(s)) {

        console.log('match = ');
        console.log(match);
        console.log('match length = ' + match.length);
        console.log('group 0: ');
        console.log(match.groups);

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

  var tmp = nodes.map(function (n, index) {
    return "<span>\n      " + (n.bold ? '<strong>' + n.content + '</strong>' : n.content) + "\n    </span>";
  });
  return tmp.join(''); // one combined string
}

function randomFont(id) {
  // https://www.reddit.com/6u1kvm
  if (!window) return;

  var sheet = window.document.styleSheets[0];
  //sheet.insertRule('strong { color: red; }'
  //sheet.cssRules.length);

  var elem = document.getElementById(id);
  if (!elem) return;
  style = elem.style;
  style.fontFamily = "random_" + Math.floor(Math.random() * 36);

  var fontSize = 14 + Math.floor(Math.random() * 8);
  console.log("setting fontsize to " + fontSize);
  style.fontSize = fontSize + "px";
}

(async function () {
  randomFont('front');
  randomFont('back');

  var front = getFront();
  var sentences = await fetchSentences(front);
  console.log("sentences = ");
  console.log(sentences);

  var index = Math.floor(Math.random() * sentences.length);
  var s = sentences[index];
  console.log('s =');
  console.log(s);
  if (s) {
    $('#front').html(formattedText(s.text, s.bold));
  }
})();