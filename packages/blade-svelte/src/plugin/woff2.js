// @ts-check
/* eslint-disable no-bitwise -- WOFF2 and TrueType pack their fields into bits */
/**
 * Wraps a TrueType font as WOFF2 (https://www.w3.org/TR/WOFF2/), compressed
 * with Node's own Brotli.
 *
 * Writing the container here, rather than with a WOFF2 package, keeps a
 * bundled Brotli out of the dependencies: the ones on npm carry its decoder,
 * which has had memory-safety advisories, and only the encoder is needed.
 */
import zlib from 'node:zlib';

/**
 * The tags WOFF2 numbers, so a table directory entry can name a common table
 * in one byte instead of five (§5.1, "Known Table Tags").
 */
const KNOWN_TAGS = [
  'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf',
  'loca', 'prep', 'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT',
  'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC', 'JSTF', 'MATH', 'CBDT',
  'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar',
  'fdsc', 'feat', 'fmtx', 'fvar', 'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd',
  'prop', 'trak', 'Zapf', 'Silf', 'Glat', 'Gloc', 'Feat', 'Sill',
]; // prettier-ignore

/** The transform versions (§4.1): `glyf` and `loca` are transformed at 0, kept as is at 3. */
const TRANSFORMED = 0;
const NULL_GLYF_LOCA = 3;

/** A UIntBase128: 7 bits a byte, most significant first, the high bit set on all but the last. */
function base128(/** @type {number} */ value) {
  const bytes = [value & 0x7f];
  for (let rest = value >>> 7; rest > 0; rest >>>= 7) bytes.unshift(0x80 | (rest & 0x7f));
  return bytes;
}

/** A 255UInt16 (§6.1.1): one byte below 253, else a code byte and one or two more. */
function write255UInt16(/** @type {number[]} */ out, /** @type {number} */ value) {
  if (value < 253) out.push(value);
  else if (value < 506) out.push(255, value - 253);
  else if (value < 762) out.push(254, value - 506);
  else out.push(253, value >> 8, value & 0xff);
}

const writeInt16 = (/** @type {number[]} */ out, /** @type {number} */ value) =>
  out.push((value >> 8) & 0xff, value & 0xff);

const writeUInt32 = (/** @type {number[]} */ out, /** @type {number} */ value) =>
  out.push(value >>> 24, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff);

/**
 * @typedef {object} SimpleGlyph
 * @property {number[]} bbox xMin, yMin, xMax, yMax
 * @property {number[]} pointCounts the points in each contour
 * @property {{ x: number; y: number; onCurve: boolean }[]} points
 * @property {Buffer} instructions
 */

/**
 * A TrueType simple glyph's outline (OpenType `glyf`), or `null` for what the
 * transform here leaves alone: composite glyphs, and outlines flagged as
 * overlapping, which need the optional overlap bitmap.
 *
 * @param {Buffer} data
 * @returns {SimpleGlyph | null}
 */
function readSimpleGlyph(data) {
  const contours = data.readInt16BE(0);
  if (contours < 0) return null;
  const bbox = [2, 4, 6, 8].map((offset) => data.readInt16BE(offset));
  let at = 10;
  const pointCounts = [];
  for (let i = 0, last = -1; i < contours; i += 1, at += 2) {
    const end = data.readUInt16BE(at);
    pointCounts.push(end - last);
    last = end;
  }
  const instructionLength = data.readUInt16BE(at);
  const instructions = data.subarray(at + 2, at + 2 + instructionLength);
  at += 2 + instructionLength;

  const count = pointCounts.reduce((sum, n) => sum + n, 0);
  /** @type {number[]} */
  const flags = [];
  while (flags.length < count) {
    const flag = data[at++];
    flags.push(flag);
    if (flag & 0x08) for (let repeat = data[at++]; repeat > 0; repeat -= 1) flags.push(flag);
  }
  if (flags.length > 0 && flags[0] & 0x40) return null;

  // Each coordinate is a delta: one byte with the sign in a flag bit, two
  // signed bytes, or none (the same as the last).
  const read = (/** @type {number} */ short, /** @type {number} */ sameOrPositive) => {
    let value = 0;
    return flags.slice(0, count).map((flag) => {
      if (flag & short) {
        const delta = data[at++];
        value += flag & sameOrPositive ? delta : -delta;
      } else if (!(flag & sameOrPositive)) {
        value += data.readInt16BE(at);
        at += 2;
      }
      return value;
    });
  };
  const xs = read(0x02, 0x10);
  const ys = read(0x04, 0x20);
  const points = xs.map((x, i) => ({ x, y: ys[i], onCurve: (flags[i] & 0x01) === 1 }));
  return { bbox, pointCounts, points, instructions };
}

/**
 * A point's delta as a triplet (§5.2): a flag byte naming how the delta is
 * stored, and the one to four bytes it takes. Google's encoder writes the same.
 *
 * @param {{ flags: number[]; glyphs: number[] }} out
 */
function writeTriplet(
  out,
  /** @type {boolean} */ onCurve,
  /** @type {number} */ dx,
  /** @type {number} */ dy,
) {
  const x = Math.abs(dx);
  const y = Math.abs(dy);
  const offCurve = onCurve ? 0 : 128;
  const xSign = dx < 0 ? 0 : 1;
  const ySign = dy < 0 ? 0 : 1;
  const signs = xSign + 2 * ySign;
  if (dx === 0 && y < 1280) {
    out.flags.push(offCurve + ((y & 0xf00) >> 7) + ySign);
    out.glyphs.push(y & 0xff);
  } else if (dy === 0 && x < 1280) {
    out.flags.push(offCurve + 10 + ((x & 0xf00) >> 7) + xSign);
    out.glyphs.push(x & 0xff);
  } else if (x < 65 && y < 65) {
    out.flags.push(offCurve + 20 + ((x - 1) & 0x30) + (((y - 1) & 0x30) >> 2) + signs);
    out.glyphs.push((((x - 1) & 0xf) << 4) | ((y - 1) & 0xf));
  } else if (x < 769 && y < 769) {
    out.flags.push(
      offCurve + 84 + 12 * (((x - 1) & 0x300) >> 8) + (((y - 1) & 0x300) >> 6) + signs,
    );
    out.glyphs.push((x - 1) & 0xff, (y - 1) & 0xff);
  } else if (x < 4096 && y < 4096) {
    out.flags.push(offCurve + 120 + signs);
    out.glyphs.push(x >> 4, ((x & 0xf) << 4) | (y >> 8), y & 0xff);
  } else {
    out.flags.push(offCurve + 124 + signs);
    out.glyphs.push(x >> 8, x & 0xff, y >> 8, y & 0xff);
  }
}

/**
 * The transformed `glyf` table (§5.1): the glyphs split into streams of like
 * values (contour counts, point counts, flags, coordinates, boxes,
 * instructions), which Brotli packs far better than the interleaved original.
 * `loca` is then left out; a decoder rebuilds both. `null` when a glyph is one
 * `readSimpleGlyph` leaves alone.
 *
 * @param {Map<string, Buffer>} tables
 * @returns {Buffer | null}
 */
function transformGlyf(tables) {
  const glyf = /** @type {Buffer} */ (tables.get('glyf'));
  const loca = /** @type {Buffer} */ (tables.get('loca'));
  const numGlyphs = /** @type {Buffer} */ (tables.get('maxp')).readUInt16BE(4);
  const indexFormat = /** @type {Buffer} */ (tables.get('head')).readInt16BE(50);
  const offsetOf = (/** @type {number} */ glyph) =>
    indexFormat ? loca.readUInt32BE(glyph * 4) : loca.readUInt16BE(glyph * 2) * 2;

  /** @type {number[]} */ const contourCounts = [];
  /** @type {number[]} */ const pointCounts = [];
  /** @type {number[]} */ const boxes = [];
  /** @type {Buffer[]} */ const instructions = [];
  const triplets = { flags: /** @type {number[]} */ ([]), glyphs: /** @type {number[]} */ ([]) };
  // One bit a glyph, most significant first, padded to whole 32-bit words.
  const boxBitmap = Buffer.alloc(Math.ceil(numGlyphs / 32) * 4);

  for (let id = 0; id < numGlyphs; id += 1) {
    const data = glyf.subarray(offsetOf(id), offsetOf(id + 1));
    const glyph = data.length > 0 ? readSimpleGlyph(data) : undefined;
    if (glyph === null) return null;
    if (!glyph || glyph.pointCounts.length === 0) {
      writeInt16(contourCounts, 0);
      continue;
    }
    writeInt16(contourCounts, glyph.pointCounts.length);
    // A decoder computes the box from the points; store it only when it differs.
    const xs = glyph.points.map(({ x }) => x);
    const ys = glyph.points.map(({ y }) => y);
    const computed = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    if (computed.some((value, i) => value !== glyph.bbox[i])) {
      boxBitmap[id >> 3] |= 0x80 >> (id & 7);
      for (const value of glyph.bbox) writeInt16(boxes, value);
    }
    for (const count of glyph.pointCounts) write255UInt16(pointCounts, count);
    let lastX = 0;
    let lastY = 0;
    for (const { x, y, onCurve } of glyph.points) {
      writeTriplet(triplets, onCurve, x - lastX, y - lastY);
      lastX = x;
      lastY = y;
    }
    write255UInt16(triplets.glyphs, glyph.instructions.length);
    instructions.push(glyph.instructions);
  }

  const instructionStream = Buffer.concat(instructions);
  /** @type {number[]} */
  const header = [];
  writeUInt32(header, 0); // reserved and optionFlags: no overlap bitmap
  writeInt16(header, numGlyphs);
  writeInt16(header, indexFormat);
  for (const size of [
    contourCounts.length,
    pointCounts.length,
    triplets.flags.length,
    triplets.glyphs.length,
    0, // compositeStream: no composite glyphs
    boxBitmap.length + boxes.length,
    instructionStream.length,
  ]) {
    writeUInt32(header, size);
  }
  return Buffer.concat([
    Buffer.from(header),
    Buffer.from(contourCounts),
    Buffer.from(pointCounts),
    Buffer.from(triplets.flags),
    Buffer.from(triplets.glyphs),
    boxBitmap,
    Buffer.from(boxes),
    instructionStream,
  ]);
}

/**
 * @param {Buffer} ttf
 * @returns {Buffer}
 */
export function toWoff2(ttf) {
  /** @type {Map<string, Buffer>} */
  const tables = new Map();
  for (let i = 0; i < ttf.readUInt16BE(4); i += 1) {
    const record = 12 + i * 16;
    const offset = ttf.readUInt32BE(record + 8);
    tables.set(
      ttf.toString('latin1', record, record + 4),
      ttf.subarray(offset, offset + ttf.readUInt32BE(record + 12)),
    );
  }
  // Tag order, as an sfnt directory has it; it also puts `loca` after `glyf`,
  // which WOFF2 requires.
  const tags = [...tables.keys()].sort();
  const glyf = tables.has('glyf') && tables.has('loca') ? transformGlyf(tables) : null;

  /** @type {number[]} */
  const directory = [];
  /** @type {Buffer[]} */
  const stream = [];
  for (const tag of tags) {
    const data = /** @type {Buffer} */ (tables.get(tag));
    const known = KNOWN_TAGS.indexOf(tag);
    const isGlyfOrLoca = tag === 'glyf' || tag === 'loca';
    const transform = isGlyfOrLoca && !glyf ? NULL_GLYF_LOCA : TRANSFORMED;
    // Bits 6–7 hold the transform, bits 0–5 the known tag's index (63: none).
    directory.push((transform << 6) | (known === -1 ? 63 : known));
    if (known === -1) directory.push(...Buffer.from(tag, 'latin1'));
    directory.push(...base128(data.length));
    if (isGlyfOrLoca && glyf) {
      // transformLength: the transformed glyf's, and none for loca, rebuilt from it.
      const transformed = tag === 'glyf' ? glyf : Buffer.alloc(0);
      directory.push(...base128(transformed.length));
      stream.push(transformed);
    } else {
      stream.push(data);
    }
  }

  const fontData = Buffer.concat(stream);
  const compressed = zlib.brotliCompressSync(fontData, {
    params: {
      [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_FONT,
      [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
      [zlib.constants.BROTLI_PARAM_SIZE_HINT]: fontData.length,
    },
  });

  const round4 = (/** @type {number} */ n) => (n + 3) & ~3;
  let totalSfntSize = 12 + 16 * tables.size;
  for (const data of tables.values()) totalSfntSize += round4(data.length);
  const length = round4(48 + directory.length + compressed.length);

  const header = Buffer.alloc(48);
  header.write('wOF2', 0, 'latin1');
  header.writeUInt32BE(ttf.readUInt32BE(0), 4); // flavor: the sfnt version
  header.writeUInt32BE(length, 8);
  header.writeUInt16BE(tables.size, 12);
  header.writeUInt32BE(totalSfntSize, 16);
  header.writeUInt32BE(compressed.length, 20);
  header.writeUInt16BE(1, 24); // the file's own version, 1.0; no metadata or private data
  const file = Buffer.alloc(length);
  Buffer.concat([header, Buffer.from(directory), compressed]).copy(file);
  return file;
}
