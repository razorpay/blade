/* eslint-disable no-bitwise -- WOFF2 and TrueType pack their fields into bits */
/**
 * Test-only readers for the fonts `buildFont` writes: a TrueType font's
 * tables and glyph outlines, and the same read back out of a WOFF2, its
 * transformed `glyf` decoded the way Google's decoder does (TripletDecode in
 * google/woff2's woff2_dec.cc), independently of the encoder under test.
 */
import zlib from 'node:zlib';

export type Point = { x: number; y: number; onCurve: boolean };
/** A glyph's outline; `null` for an empty glyph. */
export type Outline = { bbox: number[]; endPoints: number[]; points: Point[] } | null;
export type Font = { tables: Map<string, Buffer>; glyphs: Outline[] };

// WOFF2 §5.1, "Known Table Tags"
// prettier-ignore
const KNOWN_TAGS = [
  'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf',
  'loca', 'prep', 'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT',
  'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC', 'JSTF', 'MATH', 'CBDT',
  'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar',
  'fdsc', 'feat', 'fmtx', 'fvar', 'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd',
  'prop', 'trak', 'Zapf', 'Silf', 'Glat', 'Gloc', 'Feat', 'Sill',
];

const bboxOf = (points: Point[]): number[] => [
  Math.min(...points.map(({ x }) => x)),
  Math.min(...points.map(({ y }) => y)),
  Math.max(...points.map(({ x }) => x)),
  Math.max(...points.map(({ y }) => y)),
];

/** A TrueType simple glyph's outline (OpenType `glyf`). */
function readTrueTypeGlyph(data: Buffer): Outline {
  if (data.length === 0 || data.readInt16BE(0) === 0) return null;
  const contours = data.readInt16BE(0);
  if (contours < 0) throw new Error('composite glyphs are not read here');
  const endPoints = Array.from({ length: contours }, (_, i) => data.readUInt16BE(10 + i * 2));
  let at = 10 + contours * 2;
  at += 2 + data.readUInt16BE(at); // instructions
  const count = endPoints[contours - 1] + 1;
  const flags: number[] = [];
  while (flags.length < count) {
    const flag = data[at++];
    flags.push(flag);
    if (flag & 8) for (let repeat = data[at++]; repeat > 0; repeat -= 1) flags.push(flag);
  }
  const coordinates = (short: number, same: number): number[] => {
    let value = 0;
    return flags.map((flag) => {
      if (flag & short) value += flag & same ? data[at++] : -data[at++];
      else if (!(flag & same)) value += data.readInt16BE((at += 2) - 2);
      return value;
    });
  };
  const xs = coordinates(2, 16);
  const ys = coordinates(4, 32);
  return {
    bbox: [2, 4, 6, 8].map((offset) => data.readInt16BE(offset)),
    endPoints,
    points: xs.map((x, i) => ({ x, y: ys[i], onCurve: Boolean(flags[i] & 1) })),
  };
}

function glyphsOf(glyf: Buffer, loca: Buffer, head: Buffer, maxp: Buffer): Outline[] {
  const long = head.readInt16BE(50) === 1;
  const offset = (id: number): number =>
    long ? loca.readUInt32BE(id * 4) : loca.readUInt16BE(id * 2) * 2;
  return Array.from({ length: maxp.readUInt16BE(4) }, (_, id) =>
    readTrueTypeGlyph(glyf.subarray(offset(id), offset(id + 1))),
  );
}

/** A TrueType font's tables, by tag, and its glyphs' outlines (read when asked for). */
export function readTrueType(ttf: Buffer): Font {
  const tables = new Map<string, Buffer>();
  for (let i = 0; i < ttf.readUInt16BE(4); i += 1) {
    const record = 12 + i * 16;
    const offset = ttf.readUInt32BE(record + 8);
    tables.set(
      ttf.toString('latin1', record, record + 4),
      ttf.subarray(offset, offset + ttf.readUInt32BE(record + 12)),
    );
  }
  const [glyf, loca, head, maxp] = ['glyf', 'loca', 'head', 'maxp'].map((tag) => tables.get(tag)!);
  return {
    tables,
    get glyphs() {
      return glyphsOf(glyf, loca, head, maxp);
    },
  };
}

/** A transformed `glyf` table's glyphs (WOFF2 §5.1–5.2). */
function decodeGlyf(glyf: Buffer): Outline[] {
  const numGlyphs = glyf.readUInt16BE(4);
  const sizes = Array.from({ length: 7 }, (_, i) => glyf.readUInt32BE(8 + i * 4));
  let start = 36;
  const [
    contourStream,
    pointStream,
    flagStream,
    glyphStream,
    compositeStream,
    bboxStream,
    instructionStream,
  ] = sizes.map((size) => glyf.subarray(start, (start += size)));
  if (compositeStream.length > 0) throw new Error('composite glyphs are not read here');
  const bitmapSize = Math.ceil(numGlyphs / 32) * 4;
  const cursor = { points: 0, flags: 0, glyphs: 0, boxes: bitmapSize, instructions: 0 };
  const read255UInt16 = (stream: Buffer, key: 'points' | 'glyphs'): number => {
    const code = stream[cursor[key]++];
    if (code === 253) return stream.readUInt16BE((cursor[key] += 2) - 2);
    if (code === 255) return 253 + stream[cursor[key]++];
    if (code === 254) return 506 + stream[cursor[key]++];
    return code;
  };
  const withSign = (flag: number, value: number): number => (flag & 1 ? value : -value);

  const glyphs = Array.from(
    { length: numGlyphs },
    (_, id): Outline => {
      const contours = contourStream.readInt16BE(id * 2);
      const hasBox = Boolean(bboxStream[id >> 3] & (0x80 >> (id & 7)));
      if (contours === 0) {
        if (hasBox) throw new Error(`empty glyph ${id} has a bbox`);
        return null;
      }
      const endPoints: number[] = [];
      for (let i = 0, end = -1; i < contours; i += 1) {
        endPoints.push((end += read255UInt16(pointStream, 'points')));
      }
      const points: Point[] = [];
      let x = 0;
      let y = 0;
      for (let i = 0; i <= endPoints[contours - 1]; i += 1) {
        const raw = flagStream[cursor.flags++];
        const flag = raw & 0x7f;
        const b = (k: number): number => glyphStream[cursor.glyphs + k];
        let dx: number, dy: number, size: number;
        if (flag < 10) {
          [dx, dy, size] = [0, withSign(flag, ((flag & 14) << 7) + b(0)), 1];
        } else if (flag < 20) {
          [dx, dy, size] = [withSign(flag, (((flag - 10) & 14) << 7) + b(0)), 0, 1];
        } else if (flag < 84) {
          const b0 = flag - 20;
          dx = withSign(flag, 1 + (b0 & 0x30) + (b(0) >> 4));
          dy = withSign(flag >> 1, 1 + ((b0 & 0x0c) << 2) + (b(0) & 0x0f));
          size = 1;
        } else if (flag < 120) {
          const b0 = flag - 84;
          dx = withSign(flag, 1 + (Math.floor(b0 / 12) << 8) + b(0));
          dy = withSign(flag >> 1, 1 + ((b0 % 12 >> 2) << 8) + b(1));
          size = 2;
        } else if (flag < 124) {
          dx = withSign(flag, (b(0) << 4) + (b(1) >> 4));
          dy = withSign(flag >> 1, ((b(1) & 0x0f) << 8) + b(2));
          size = 3;
        } else {
          dx = withSign(flag, (b(0) << 8) + b(1));
          dy = withSign(flag >> 1, (b(2) << 8) + b(3));
          size = 4;
        }
        cursor.glyphs += size;
        x += dx;
        y += dy;
        points.push({ x, y, onCurve: !(raw >> 7) });
      }
      cursor.instructions += read255UInt16(glyphStream, 'glyphs');
      let bbox = bboxOf(points);
      if (hasBox) {
        bbox = [0, 2, 4, 6].map((k) => bboxStream.readInt16BE(cursor.boxes + k));
        cursor.boxes += 8;
      }
      return { bbox, endPoints, points };
    },
  );
  // Every stream read to its end: no glyph took more or less than it wrote.
  const consumed = {
    points: cursor.points === pointStream.length,
    flags: cursor.flags === flagStream.length,
    glyphs: cursor.glyphs === glyphStream.length,
    boxes: cursor.boxes === bboxStream.length,
    instructions: cursor.instructions === instructionStream.length,
  };
  if (Object.values(consumed).includes(false)) {
    throw new Error(`streams not read to their end: ${JSON.stringify(consumed)}`);
  }
  return glyphs;
}

/**
 * A WOFF2's tables, by tag, its glyphs' outlines, and each table's transform
 * version. A transformed `glyf` and `loca` are left out of `tables`.
 */
export function readWoff2(woff2: Buffer): Font & { transforms: Map<string, number> } {
  let at = 48;
  const readBase128 = (): number => {
    let value = 0;
    for (;;) {
      const byte = woff2[at++];
      value = value * 128 + (byte & 0x7f);
      if (!(byte & 0x80)) return value;
    }
  };
  const directory: { tag: string; transform: number; length: number }[] = [];
  for (let i = 0; i < woff2.readUInt16BE(12); i += 1) {
    const flags = woff2[at++];
    const tag =
      (flags & 0x3f) === 63 ? woff2.toString('latin1', at, (at += 4)) : KNOWN_TAGS[flags & 0x3f];
    const transform = flags >> 6;
    const origLength = readBase128();
    const transformed = tag === 'glyf' || tag === 'loca' ? transform === 0 : transform !== 0;
    directory.push({ tag, transform, length: transformed ? readBase128() : origLength });
  }
  const stream = zlib.brotliDecompressSync(woff2.subarray(at, at + woff2.readUInt32BE(20)));
  if (directory.reduce((sum, { length }) => sum + length, 0) !== stream.length) {
    throw new Error("the directory's lengths don't add up to the font data");
  }
  const tables = new Map<string, Buffer>();
  const transforms = new Map<string, number>();
  let offset = 0;
  for (const { tag, transform, length } of directory) {
    tables.set(tag, stream.subarray(offset, (offset += length)));
    transforms.set(tag, transform);
  }
  const [glyf, loca, head, maxp] = ['glyf', 'loca', 'head', 'maxp'].map((tag) => tables.get(tag)!);
  if (transforms.get('glyf') === 0) {
    tables.delete('glyf');
    tables.delete('loca');
    return { tables, transforms, glyphs: decodeGlyf(glyf) };
  }
  return {
    tables,
    transforms,
    get glyphs() {
      return glyphsOf(glyf, loca, head, maxp);
    },
  };
}
