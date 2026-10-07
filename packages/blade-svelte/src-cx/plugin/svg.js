// @ts-check
/**
 * Turns one icon SVG into what a font can hold: a single path, filled by the
 * nonzero rule. SVG paints each element separately and may fill by evenodd;
 * a glyph is one outline filled by nonzero winding. So every subpath is
 * oriented by how deeply it nests (outer shapes one way, holes the other),
 * and each element's outer shapes the same way, so that elements unite.
 */
import { SVGPathData } from 'svg-pathdata';

const { MOVE_TO, LINE_TO, CURVE_TO, CLOSE_PATH } = SVGPathData;

/** @typedef {{ x: number; y: number }} Point */
/** @typedef {{ to: Point; c1?: Point; c2?: Point }} Segment */
/** @typedef {{ start: Point; segments: Segment[] }} Subpath */

/** @param {string} message */
const fail = (message) => {
  throw new Error(message);
};

/** @param {string} attributes @param {string} name */
const attribute = (attributes, name) =>
  new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`).exec(attributes)?.slice(1).find(
    (value) => value !== undefined,
  );

/** @param {string} attributes @param {string} name */
const number = (attributes, name) => Number(attribute(attributes, name) ?? 0);

/** circle, ellipse, rect and polygon as path data. */
function shapeToPath(/** @type {string} */ tag, /** @type {string} */ attributes) {
  if (tag === 'path') return attribute(attributes, 'd') ?? '';
  if (tag === 'circle' || tag === 'ellipse') {
    const cx = number(attributes, 'cx');
    const cy = number(attributes, 'cy');
    const rx = tag === 'circle' ? number(attributes, 'r') : number(attributes, 'rx');
    const ry = tag === 'circle' ? rx : number(attributes, 'ry');
    return `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`;
  }
  if (tag === 'rect') {
    const x = number(attributes, 'x');
    const y = number(attributes, 'y');
    const w = number(attributes, 'width');
    const h = number(attributes, 'height');
    const r = Math.min(Number(attribute(attributes, 'rx') ?? attribute(attributes, 'ry') ?? 0), w / 2, h / 2);
    if (!r) return `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
    return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  }
  // polygon
  const points = (attribute(attributes, 'points') ?? '').trim().split(/[\s,]+/).map(Number);
  const pairs = [];
  for (let i = 0; i + 1 < points.length; i += 2) pairs.push(`${points[i]} ${points[i + 1]}`);
  return `M${pairs.join('L')}Z`;
}

/** Absolute moves, lines and cubics only, split at each move. */
function toSubpaths(/** @type {string} */ d) {
  const commands = new SVGPathData(d)
    .toAbs()
    .normalizeHVZ(false, true, true)
    .normalizeST()
    .qtToC()
    .aToC().commands;
  /** @type {Subpath[]} */
  const subpaths = [];
  /** @type {Subpath | undefined} */
  let current;
  for (const command of commands) {
    if (command.type === MOVE_TO) {
      current = { start: { x: command.x, y: command.y }, segments: [] };
      subpaths.push(current);
    } else if (command.type === LINE_TO && current) {
      current.segments.push({ to: { x: command.x, y: command.y } });
    } else if (command.type === CURVE_TO && current) {
      current.segments.push({
        to: { x: command.x, y: command.y },
        c1: { x: command.x1, y: command.y1 },
        c2: { x: command.x2, y: command.y2 },
      });
    } else if (command.type === CLOSE_PATH && current) {
      // A move after a close starts at the close point, which the next M says.
      current = { start: current.start, segments: [] };
      subpaths.push(current);
    }
  }
  return subpaths.filter((subpath) => subpath.segments.length > 0);
}

/** The outline as a polygon, each cubic in eight steps. */
function flatten(/** @type {Subpath} */ subpath) {
  const points = [subpath.start];
  let from = subpath.start;
  for (const { to, c1, c2 } of subpath.segments) {
    if (c1 && c2) {
      for (let step = 1; step <= 8; step += 1) {
        const t = step / 8;
        const u = 1 - t;
        points.push({
          x: u * u * u * from.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * to.x,
          y: u * u * u * from.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * to.y,
        });
      }
    } else {
      points.push(to);
    }
    from = to;
  }
  return points;
}

/** Shoelace: the sign is the direction, in SVG's y-down space. */
function signedArea(/** @type {Point[]} */ polygon) {
  let area = 0;
  for (let i = 0; i < polygon.length; i += 1) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    area += a.x * b.y - b.x * a.y;
  }
  return area / 2;
}

function contains(/** @type {Point[]} */ polygon, /** @type {Point} */ point) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    if (a.y > point.y !== b.y > point.y && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

/** The same outline walked the other way. */
function reverse(/** @type {Subpath} */ subpath) {
  const segments = [...subpath.segments];
  const last = segments[segments.length - 1].to;
  if (last.x !== subpath.start.x || last.y !== subpath.start.y) {
    segments.push({ to: subpath.start });
  }
  /** @type {Segment[]} */
  const reversed = [];
  for (let i = segments.length - 1; i >= 0; i -= 1) {
    const to = i === 0 ? subpath.start : segments[i - 1].to;
    const { c1, c2 } = segments[i];
    reversed.push(c1 && c2 ? { to, c1: c2, c2: c1 } : { to });
  }
  return { start: subpath.start, segments: reversed };
}

const format = (/** @type {number} */ value) => Number(value.toFixed(4)).toString();
const pair = (/** @type {Point} */ point) => `${format(point.x)} ${format(point.y)}`;

function encode(/** @type {Subpath[]} */ subpaths) {
  return subpaths
    .map(
      ({ start, segments }) =>
        `M${pair(start)}${segments
          .map(({ to, c1, c2 }) => (c1 && c2 ? `C${pair(c1)} ${pair(c2)} ${pair(to)}` : `L${pair(to)}`))
          .join('')}Z`,
    )
    .join('');
}

/**
 * One element's subpaths, oriented for nonzero: under evenodd by nesting
 * depth; under nonzero kept as drawn, flipped whole if its outer shapes run
 * backwards. Either way the outer shapes end up positive.
 */
function orient(/** @type {Subpath[]} */ subpaths, /** @type {boolean} */ isEvenOdd) {
  const polygons = subpaths.map(flatten);
  const depths = subpaths.map(
    (subpath, i) => polygons.filter((polygon, j) => j !== i && contains(polygon, subpath.start)).length,
  );
  if (isEvenOdd) {
    return subpaths.map((subpath, i) => {
      const wantsPositive = depths[i] % 2 === 0;
      return signedArea(polygons[i]) > 0 === wantsPositive ? subpath : reverse(subpath);
    });
  }
  const outer = polygons.filter((_, i) => depths[i] === 0).reduce((sum, polygon) => sum + signedArea(polygon), 0);
  return outer >= 0 ? subpaths : subpaths.map(reverse);
}

/**
 * A glyph is an em square: a wide or tall drawing keeps its proportions and
 * sits centred in the square its longer side makes.
 */
function square(/** @type {string} */ viewBox, /** @type {string} */ name) {
  const [x, y, width, height] = viewBox.trim().split(/[\s,]+/).map(Number);
  if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) {
    fail(`blade-icons: "${name}" has a malformed viewBox`);
  }
  const side = Math.max(width, height);
  return [x - (side - width) / 2, y - (side - height) / 2, side, side].map(format).join(' ');
}

/**
 * @param {string} svg the file's markup
 * @param {string} name the glyph's name, for errors
 * @returns {{ viewBox: string; d: string }}
 */
export function prepareSvg(svg, name) {
  const viewBox = /<svg\b[^>]*\bviewBox\s*=\s*["']([^"']+)["']/.exec(svg)?.[1];
  if (!viewBox) fail(`blade-icons: "${name}" has no viewBox`);
  const body = svg.replace(/<defs\b[\s\S]*?<\/defs>/g, '').replace(/<clipPath\b[\s\S]*?<\/clipPath>/g, '');
  if (/<(text|image|use|mask|pattern|linearGradient|radialGradient|filter)\b/.test(body)) {
    fail(`blade-icons: "${name}" uses text, images, masks or gradients; an icon is plain shapes`);
  }
  if (/\btransform\s*=/.test(body)) fail(`blade-icons: "${name}" has a transform; flatten it first`);
  if (/\bstroke\s*=\s*["'](?!none)/.test(body) || /\bstroke-width\s*=/.test(body)) {
    fail(`blade-icons: "${name}" draws strokes; a font only fills, so outline them first`);
  }
  const paints = new Set(
    [...body.matchAll(/\bfill\s*=\s*["']([^"']+)["']/g)]
      .map(([, value]) => value.toLowerCase())
      .filter((value) => value !== 'none' && value !== 'currentcolor'),
  );
  if (paints.size > 1 || [...paints].some((value) => value.startsWith('url('))) {
    fail(`blade-icons: "${name}" has more than one colour; icons are single-colour, use an Image`);
  }
  if (/\b(fill-)?opacity\s*=/.test(body)) {
    fail(`blade-icons: "${name}" uses opacity; icons are single-colour, use an Image`);
  }
  const rootIsEvenOdd = /<(svg|g)\b[^>]*\bfill-rule\s*=\s*["']evenodd/.test(svg);
  const subpaths = [...body.matchAll(/<(path|circle|ellipse|rect|polygon)\b([^>]*?)\/?>/g)].flatMap(
    ([, tag, attributes]) => {
      if (attribute(attributes, 'fill') === 'none') return [];
      const rule = attribute(attributes, 'fill-rule');
      const isEvenOdd = rule ? rule === 'evenodd' : rootIsEvenOdd;
      return orient(toSubpaths(shapeToPath(tag, attributes)), isEvenOdd);
    },
  );
  if (subpaths.length === 0) fail(`blade-icons: "${name}" draws nothing`);
  return { viewBox: square(/** @type {string} */ (viewBox), name), d: encode(subpaths) };
}
