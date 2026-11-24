/**
 * Tidies the chat text RAY writes before it is drawn. Each rule comes from RAY's live chats
 * (the ray-chat skill's writing rules); RAY should stop writing these, and until it does the
 * chat leaves them out:
 *
 *  - the JSON wrapper  ```json {"assistant_reply": "…"} ```  → the reply inside it, even while it streams
 *  - literal `\n` (a backslash and an n)                    → a real line break, outside code
 *  - emoji                                                   → dropped ("NO EMOJIS EVER"), outside code
 *  - a Markdown table                                        → an aligned plain-text block. Tables are
 *    drawn as cards, so the chat doesn't parse them (no remark-gfm); left alone they'd be rows of pipes.
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
const FENCED_CODE = /(```[\s\S]*?(?:```|$))/;
const INLINE_CODE = /(`[^`\n]*`)/;
const CODE = /(```[\s\S]*?(?:```|$)|`[^`\n]*`)/;

/** Applies `tidy` to the text outside `code` (a pattern with one capturing group). */
const mapOutside = (code: RegExp, text: string, tidy: (prose: string) => string): string =>
  text
    .split(code)
    .map((part, index) => (index % 2 === 1 ? part : tidy(part)))
    .join('');

const realLineBreaks = (prose: string): string => prose.replace(/\\r\\n|\\n/g, '\n');

// One emoji: a flag, a keycap, or a pictograph in emoji style with its skin tone and
// zero-width-joined parts. Text symbols such as ©, ™ and ✔ are only emoji with U+FE0F after them.
const EMOJI_SOURCE =
  '(?:\\p{Regional_Indicator}{2}|[#*0-9]\\uFE0F?\\u20E3|' +
  '(?:\\p{Emoji_Presentation}|\\p{Extended_Pictographic}\\uFE0F)' +
  '(?:\\p{Emoji_Modifier}|\\uFE0F|\\u200D(?:\\p{Emoji_Presentation}|\\p{Extended_Pictographic})\\uFE0F?)*)';
// Built with the constructor: the ES2019 target won't take \p{…} in a regex literal.
const EMOJI_RUN = new RegExp(`( ?)(?:${EMOJI_SOURCE} ?)*${EMOJI_SOURCE}( ?)`, 'gu');

// An emoji between two spaces leaves one; at either end of a line it leaves none.
const dropEmoji = (prose: string): string =>
  prose.replace(EMOJI_RUN, (_run, before: string, after: string) => (before && after ? ' ' : ''));

// A table starts at a line that opens with a pipe, so a streaming table is a block from its first
// row; or at a row with pipes followed by a delimiter row such as --- | ---:.
const TABLE_DELIMITER = /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)*\|?\s*$/;
const COLUMN_GAP = '   ';

const isTableStart = (lines: string[], index: number): boolean =>
  /^\s*\|/.test(lines[index]) ||
  (lines[index].includes('|') &&
    (lines[index + 1] ?? '').includes('|') &&
    TABLE_DELIMITER.test(lines[index + 1]));

/** A row's cells; `\|` is a pipe inside a cell. */
const splitCells = (row: string): string[] =>
  row
    .trim()
    .replace(/^\|/, '')
    .replace(/(?<!\\)\|$/, '')
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim());

/** A cell as plain text: no emoji, bold, italic, code ticks or link targets. Underscores stay (IDs). */
const plainCell = (cell: string): string =>
  dropEmoji(cell)
    .replace(/\\\|/g, '|')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .trim();

/** Rows padded into columns; a `---:` column is aligned right. */
const alignRows = (rows: string[][], isRightAligned: boolean[]): string[] => {
  const columns = Math.max(...rows.map((row) => row.length));
  const widths = Array.from({ length: columns }, (_, column) =>
    Math.max(...rows.map((row) => (row[column] ?? '').length)),
  );
  return rows.map((row) =>
    widths
      .map((width, column) => {
        const cell = row[column] ?? '';
        return isRightAligned[column] ? cell.padStart(width) : cell.padEnd(width);
      })
      .join(COLUMN_GAP)
      .trimEnd(),
  );
};

const tablesAsText = (prose: string): string => {
  const lines = prose.split('\n');
  const out: string[] = [];
  for (let index = 0; index < lines.length; index++) {
    if (!isTableStart(lines, index)) {
      out.push(lines[index]);
      continue;
    }
    const rows: string[][] = [];
    let isRightAligned: boolean[] = [];
    let next = index;
    while (next < lines.length && lines[next].includes('|')) {
      if (TABLE_DELIMITER.test(lines[next])) {
        isRightAligned = splitCells(lines[next]).map((cell) => cell.endsWith(':'));
      } else {
        rows.push(splitCells(lines[next]).map(plainCell));
      }
      next += 1;
    }
    out.push(
      ...(rows.length
        ? ['```', ...alignRows(rows, isRightAligned), '```']
        : lines.slice(index, next)),
    );
    index = next - 1;
  }
  return out.join('\n');
};

const cleanRayText = (text: string): string => {
  const tidied = mapOutside(FENCED_CODE, unwrapReply(text), (prose) =>
    tablesAsText(mapOutside(INLINE_CODE, prose, realLineBreaks)),
  );
  return mapOutside(CODE, tidied, dropEmoji).trim();
};

export { cleanRayText };
