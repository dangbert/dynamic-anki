/**
 * gets the html content and stripped text content of the front of the anki card.
 * https://www.geeksforgeeks.org/how-to-get-all-html-content-from-domparser-excluding-the-outer-body-tag/
 */
export function getFront() {
  const orig = $("#front").html(); // eslint-disable-line
  // get just the inner html values
  const parser = new DOMParser();
  let doc = parser.parseFromString(orig, "text/html");

  const val = doc.all[0].textContent;
  //console.log("parsed val = "); console.log(val);

  // remove unwanted portions of string
  return [orig, trimContents(val)];
}

const EXCLUDE_PATTERNS = [
  /(\([^()]*\))/, // "(E)", "(EN)", etc
  /(\[[^[\]]*\])/, // "[P]", "[PT]", etc
  /(\[[^[\]]*\])/, // "[P]", "[PT]", etc
  /(-&gt|->)/,     // "->", "-&gt"
  /(Replay)/,     // hack for Android (must be coming from audio element...)
];

/**
 * returns provided string once any poritions matching EXCLUDE_PATTERNS are removed.
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

export async function fetchSentences(val) {
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
export function formattedText(text, bold) {
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


export function randomFont(id) {
  // https://www.reddit.com/6u1kvm
  //var sheet = window.document.styleSheets[0];
  //sheet.insertRule('strong { color: red; }'
  //sheet.cssRules.length);

  const elem = document.getElementById(id);
  if (!elem) return;
  const style = elem.style;
  style.fontFamily = "random_" + Math.floor(Math.random() * 36);

  const fontSize = 14 + Math.floor(Math.random() * 8);
  console.log("setting fontsize to " + fontSize);
  style.fontSize = `${fontSize}px`;
}

(async () => {
  randomFont('front');
  randomFont('back');

  const [frontHtml, frontText] = getFront();
  console.log('frontHtml = ');
  console.log(frontHtml);
  console.log(`frontText="${frontText}"`);

  const sentences = await fetchSentences(frontText);
  console.log("sentences = ");
  console.log(sentences);

  const index = Math.floor(Math.random() * sentences.length);
  const s = sentences[index];
  console.log('s =');
  console.log(s);
  if (s) {
    // eslint-disable-next-line
    $('#front').html(`
      ${formattedText(s.text, s.bold)}
      <br/><br/>
      ${frontHtml}
    `);
  }
})();