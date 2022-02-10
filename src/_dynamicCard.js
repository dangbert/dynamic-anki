/**
 * gets the html content and stripped text content of a given text element (specified by id).
 * e.g. gets the text content of the front of the Anki card.
 * https://www.geeksforgeeks.org/how-to-get-all-html-content-from-domparser-excluding-the-outer-body-tag/
 */
function parseText(id, removeArticle=true) {
  const orig = $(`#${id}`).html(); // eslint-disable-line
  // get just the inner html values
  const parser = new DOMParser();
  let doc = parser.parseFromString(orig, "text/html");

  const val = doc.all[0].textContent;
  //console.log("parsed val = "); console.log(val);

  // remove unwanted portions of string
  let res = trimContents(val);
  if (removeArticle) {
    res = stripArticle(res);
  }
  return [orig, res];
}

const EXCLUDE_PATTERNS = [
  /(\([^()]*\))/, // "(E)", "(EN)", etc
  /(\[[^[\]]*\])/, // "[P]", "[PT]", etc
  /(\[[^[\]]*\])/, // "[P]", "[PT]", etc
  /(-&gt|->)/,     // "->", "-&gt"
  /(Replay)/,     // hack for Android (must be coming from audio element...)
];

/**
 * Returns provided string once any portions matching EXCLUDE_PATTERNS are removed.
 */
export function trimContents(s) {
  s = s.trim();

  for (let p of EXCLUDE_PATTERNS) {
    const regex = new RegExp(p, 'ig');
    let match;
    // eslint-disable-next-line
    while (match = regex.exec(s)) {
      const left = s.substring(0, match.index), right = s.substring(match.index + match[0].length + 1, s.length);
      s = left + right;
      //console.log(`left: "${left}", right: "${right}", s: "${s}"`);
    }
  }
  return s.trim();
}

const EXCLUDE_ARTICLES = [
  // spanish articles
  "los", "los", "las", "las",
  "unos", "unos", "unas", "unas",
  "el", "el", "la", "la",
  "un", "un", "una", "una",

  // portuguese articles
  "os", "as", "o", "a",
  "um", "uma", "umas", "uns",

  // english articles
  "the", "a", "an", 

  // german articles
  //   https://www.clozemaster.com/blog/german-definite-articles/
  "der", "die", "das", "die",
  "den", "dem", "des",

  // french articles
  //   https://mylanguages.org/french_articles.php
  "L’", // TODO: get this one to work (it isn't followed by a space)
  "le", "la", "les",
  "un", "une", "des",

  // greek articles
  //  https://www.foundalis.com/lan/definart.htm
  "ο", "η", "το",
  "του", "της",	"του",
  "τον", "την",	"το",
  "οι", "οι", "τα",
  "των", "των",	"των",
  "τους", "τις", "τα",
];

/**
 * Removes any leading grammar articles from the given text string, and returns the result.
 */
export function stripArticle(s) {
  s = s.trim();

  for (const art of EXCLUDE_ARTICLES) {
    //console.log("checking for article: " + art);
    const index = s.toLowerCase().indexOf(art.toLowerCase())
    // ensure any match is a complete word (i.e. followed by a space)
    if (index === 0 && s[art.length] === ' ') {
      //console.log('found match, index = ' + index);
      return s.substring(art.length).trim();
    }
  }
  return s;
}

async function fetchSentences(val) {
  //const data = await $.get('http://localhost:5000/api/tools/vocab/sentences', {phrase: val, offset: 0 });
  // eslint-disable-next-line
  const data = await $.get('https://beta.engbert.me/api/tools/vocab/sentences', {phrase: val, offset: 0 });
  console.log('api call result:');
  console.log(data);
  return data.sentences;
}

/**
 * format a sentence by bolding the desired indices.
 * based on https://github.com/dangbert/personalpedia/blob/master/react-app/src/components/ToolsApp/Vocab.tsx#L142
 */
function formattedText(text, bold) {
  let index = 0;
  const nodes = [];
  for (let b of bold) {
    if (index < b[0]) {
      nodes.push({
        content: text.substring(index, b[0]),
        bold: false,
      });
    }
    nodes.push({
      content: text.substring(b[0], b[1] + 1),
      bold: true,
    });
    index = b[1] + 1;
  }
  if (index < text.length) {
    nodes.push({
      content: text.substring(index, text.length),
      bold: false,
    });
  }

  const tmp = nodes.map((n) => (
    `<span>
      ${n.bold ? '<strong>' + n.content + '</strong>' : n.content}
    </span>`
  ));
  return tmp.join(''); // one combined string
}


function randomFont(id) {
  // https://www.reddit.com/6u1kvm
  //var sheet = window.document.styleSheets[0];
  //sheet.insertRule('strong { color: red; }'
  //sheet.cssRules.length);

  const elem = document.getElementById(id);
  if (!elem) return;
  const style = elem.style;
  style.fontFamily = "random_" + Math.floor(Math.random() * 36);

  const fontSize = 16 + Math.floor(Math.random() * 8);
  console.log("setting fontsize to " + fontSize);
  style.fontSize = `${fontSize}px`;
}

/**
 * Defines possible actions for how to handle injecting a sentence into an element.
 * TOOD: can make this enum when we start using typescript
 * https://masteringjs.io/tutorials/fundamentals/enum
 */
const InjectionAction = {
  Prepend: 'prepend',
  Append: 'append',
  Replace: 'replace',
};

/**
 * Modifies a given html element by injecting a relevant sentence to its contents (if possible).
 * @param {string} id html element ID
 * @param {string} prepend key in InjectionAction, defining how to insert the sentence.
 * @returns {void}
 */
async function injectSentences(id, mode=InjectionAction.Prepend, removeArticle=true) {
  const $elem = $(`#${id}`); // eslint-disable-line
  const [elemHtml, elemText] = parseText(id, removeArticle);
  console.log('elemHtml = ');
  console.log(elemHtml);
  console.log(`elemText="${elemText}"`);

  // large texts are unlikely to get a sentence match
  if (elemText.length > 35) {
    console.log('skipping sentence lookup for large text');
    return;
  }
  const sentences = await fetchSentences(elemText);
  console.log("sentences = ");
  console.log(sentences);

  const index = Math.floor(Math.random() * sentences.length);
  const s = sentences[index];
  console.log('s =');
  console.log(s);

  if (!s) return;

  let newHtml = `${formattedText(s.text, s.bold)}`;
  if (mode === InjectionAction.Prepend) {
    newHtml = `${newHtml}<br/><br/>${elemHtml}`;
  } else if (mode === InjectionAction.Append) {
    newHtml = `${elemHtml}<br/><br/>${newHtml}`;
  }

  $elem.html(newHtml); // eslint-disable-line
}

function elementExists(id) {
  const $elem = $(`#${id}`); // eslint-disable-line
  return $elem.length > 0;
}



(async () => {
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