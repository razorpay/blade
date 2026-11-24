/**
 * Tidies the chat text RAY writes before it is drawn. Each rule comes from RAY's live chats
 * (the ray-chat skill's writing rules); RAY should stop writing these, and until it does the
 * chat leaves them out:
 *
 *  - the JSON wrapper  ```json {"assistant_reply": "…"} ```  → the reply inside it, even while it streams
 *  - literal `\n` (a backslash and an n)                    → a real line break, outside code
 *  - emoji                                                   → dropped ("NO EMOJIS EVER"), outside code
 */

// The wrapper's start: an optional ```json fence, then {"assistant_reply": "
const WRAPPER_START = /^\s*(?:```(?:json)?\s*)?\{\s*"assistant_reply"\s*:\s*"/;

const JSON_ESCAPES: Record<string, string> = {
  '"': '"',
  '\\': '\\',
  '/': '/',
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t',
};

/**
 * Reads a JSON string body up to its closing quote, or to the end of what has arrived so far.
 * An escape cut off by the end of a stream is left out until the rest of it arrives.
 */
const readJsonString = (body: string): string => {
  let out = '';
  for (let i = 0; i < body.length; i++) {
    const char = body[i];
    if (char === '"') return out;
    if (char !== '\\') {
      out += char;
      continue;
    }
    const code = body[i + 1];
    if (code === undefined) return out;
    if (code === 'u') {
      const hex = body.slice(i + 2, i + 6);
      if (!/^[0-9a-fA-F]{4}$/.test(hex)) return out;
      out += String.fromCharCode(parseInt(hex, 16));
      i += 5;
      continue;
    }
    out += JSON_ESCAPES[code] ?? code;
    i += 1;
  }
  return out;
};

const unwrapReply = (text: string): string => {
  const start = WRAPPER_START.exec(text);
  return start ? readJsonString(text.slice(start[0].length)) : text;
};

// Code is left as written: fenced blocks (including one still streaming) and inline code.
const CODE = /(```[\s\S]*?(?:```|$)|`[^`\n]*`)/;

// One emoji: a flag, a keycap, or a pictograph in emoji style with its skin tone and
// zero-width-joined parts. Text symbols such as ©, ™ and ✔ are only emoji with U+FE0F after them.
const EMOJI_SOURCE =
  '(?:\\p{Regional_Indicator}{2}|[#*0-9]\\uFE0F?\\u20E3|' +
  '(?:\\p{Emoji_Presentation}|\\p{Extended_Pictographic}\\uFE0F)' +
  '(?:\\p{Emoji_Modifier}|\\uFE0F|\\u200D(?:\\p{Emoji_Presentation}|\\p{Extended_Pictographic})\\uFE0F?)*)';
// Built with the constructor: the ES2019 target won't take \p{…} in a regex literal.
const EMOJI_RUN = new RegExp(`( ?)(?:${EMOJI_SOURCE} ?)*${EMOJI_SOURCE}( ?)`, 'gu');

const tidyProse = (prose: string): string =>
  prose
    .replace(/\\r\\n|\\n/g, '\n')
    // An emoji between two spaces leaves one; at either end of a line it leaves none.
    .replace(EMOJI_RUN, (_run, before: string, after: string) => (before && after ? ' ' : ''));

const cleanRayText = (text: string): string =>
  unwrapReply(text)
    .split(CODE)
    .map((part, index) => (index % 2 === 1 ? part : tidyProse(part)))
    .join('')
    .trim();

export { cleanRayText };
