/**
 * get text content of front of anki card (just inner html values).
 * https://www.geeksforgeeks.org/how-to-get-all-html-content-from-domparser-excluding-the-outer-body-tag/
 */
export function getFront() {
  let val = $("#front").html();
  const parser = new DOMParser();
  let doc = parser.parseFromString(val, "text/html");

  val = doc.all[0].textContent;
  //console.log("parsed val = "); console.log(val);
  return trimContents(val);
}

export function trimContents(s) {
  return s.trim();
}

export async function fetchSentences(val) {
  //const data = await $.get('http://localhost:5000/api/tools/vocab/sentences', {phrase: val, offset: 0 });
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

  const tmp = nodes.map((n, index) => (
    `<span>
      ${n.bold ? '<strong>' + n.content + '</strong>' : n.content}
    </span>`
  ));
  return tmp.join(''); // one combined string
}


export function randomFont(id) {
  // https://www.reddit.com/6u1kvm
  if (!window) return;

  var sheet = window.document.styleSheets[0];
  //sheet.insertRule('strong { color: red; }'
  //sheet.cssRules.length);

  const elem = document.getElementById(id);
  if (!elem) return;
  style = elem.style;
  style.fontFamily = "random_" + Math.floor(Math.random() * 36);

  const fontSize = 14 + Math.floor(Math.random() * 8);
  console.log("setting fontsize to " + fontSize);
  style.fontSize = `${fontSize}px`;
}

(async () => {
  randomFont('front');
  randomFont('back');

  const front = getFront();
  const sentences = await fetchSentences(front);
  console.log("sentences = ");
  console.log(sentences);

  const index = Math.floor(Math.random() * sentences.length);
  const s = sentences[index];
  console.log('s =');
  console.log(s);
  if (s) {
    $('#front').html(formattedText(s.text, s.bold));
  }
})();