/*
 * swapToPhosphor.mjs
 * -------------------
 * Replaces Blade's generic UI icons with Phosphor Icons (https://phosphoricons.com).
 *
 * Usage (from repo root): node scripts/icons/swapToPhosphor.mjs
 *
 * How it works:
 *   1. Reads the ICON_MAP below: bladeIcon name -> phosphorIcon name.
 *   2. Fetches the Phosphor SVG for each icon from the @phosphor-icons/core npm package.
 *   3. Converts it to a Blade icon component:
 *        - rescales path/element coordinates from Phosphor's 256x256 grid to Blade's 24x24 grid
 *        - replaces fill="currentColor" with fill={iconColor}
 *        - writes <Name>/index.ts and <Name>/<Name>.tsx in packages/blade/src/components/Icons/
 *
 * Only icons listed in BATCH are processed. Set BATCH to the full set of mapped icons
 * to run the whole swap.
 */
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '../..');
const ICONS_DIR = path.join(REPO_ROOT, 'packages/blade/src/components/Icons');

const PHOSPHOR_SRC = 'https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2/assets';
const SCALE = 24 / 256; // Blade viewBox 24x24, Phosphor viewBox 256x256

/**
 * bladeIcon -> phosphorIcon.
 * Phosphor weights: regular (default), bold, fill, duotone, thin, light.
 * Specify { name, weight? } when a non-regular weight is needed.
 */
const ICON_MAP = {
  ArrowDownIcon: 'arrow-down',
  ArrowLeftIcon: 'arrow-left',
  ArrowRightIcon: 'arrow-right',
  ArrowUpIcon: 'arrow-up',
  BellIcon: 'bell',
  CalendarIcon: 'calendar',
  CheckIcon: 'check',
  ChevronDownIcon: 'caret-down',
  ChevronLeftIcon: 'caret-left',
  ChevronRightIcon: 'caret-right',
  ChevronUpIcon: 'caret-up',
  CloseIcon: 'x',
  DownloadIcon: 'download-simple',
  EditIcon: 'pencil-simple',
  ExternalLinkIcon: 'arrow-square-out',
  EyeIcon: 'eye',
  EyeOffIcon: 'eye-slash',
  FilterIcon: 'funnel-simple',
  HelpCircleIcon: 'question',
  HomeIcon: 'house',
  InfoIcon: 'info',
  LinkIcon: 'link',
  LockIcon: 'lock',
  MailIcon: 'envelope',
  MinusIcon: 'minus',
  PlusIcon: 'plus',
  RefreshIcon: 'arrows-clockwise',
  SearchIcon: 'magnifying-glass',
  SettingsIcon: 'gear',
  ShareIcon: 'share',
  StarIcon: 'star',
  StarFilledIcon: { name: 'star', weight: 'fill' },
  TrashIcon: 'trash',
  UploadIcon: 'upload-simple',
  UserIcon: 'user',
  UsersIcon: 'users',
  WifiIcon: 'wifi-high',
  ZapIcon: 'lightning',
};

// Which mapped icons to convert in this run. Defaults to the full mapping.
const BATCH = process.argv[2] ? process.argv[2].split(',') : Object.keys(ICON_MAP);

/* ------------------------------------------------------------------ */
/* SVG path scaling                                                     */
/* ------------------------------------------------------------------ */

// Number of parameters per SVG path command (absolute).
const PATH_PARAM_COUNTS = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
};

// For 'A' commands, the large-arc-flag and sweep-flag are parameter indices 3 and 4 (0-based)
// and must NOT be scaled.
const ARC_FLAG_INDICES = new Set([3, 4]);

const NUMBER_RE = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g;

function scalePathData(d, factor) {
  // Tokenize into command letters and numbers, preserving everything else (commas/spaces).
  const tokens = d.match(/[a-zA-Z]|[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g) || [];
  const out = [];
  let cmd = null;
  let paramIndex = 0;
  for (const tok of tokens) {
    if (/[a-zA-Z]/.test(tok)) {
      cmd = tok.toUpperCase();
      paramIndex = 0;
      out.push(tok);
      continue;
    }
    if (!cmd) {
      out.push(tok);
      continue;
    }
    const total = PATH_PARAM_COUNTS[cmd] ?? 0;
    const isFlag = cmd === 'A' && ARC_FLAG_INDICES.has(paramIndex);
    const value = Number(tok);
    out.push(isFlag ? tok : String(Math.round(value * factor * 100) / 100));
    paramIndex += 1;
    if (total > 0 && paramIndex >= total) paramIndex = 0;
  }
  return out.join(' ');
}

function scaleElementAttributes(node) {
  const scalarAttrs = {
    path: ['d'],
    circle: ['cx', 'cy', 'r'],
    ellipse: ['cx', 'cy', 'rx', 'ry'],
    rect: ['x', 'y', 'width', 'height', 'rx', 'ry'],
    line: ['x1', 'y1', 'x2', 'y2'],
    polyline: ['points'],
    polygon: ['points'],
    linearGradient: null,
    radialGradient: null,
    stop: null,
    defs: null,
    g: null,
  };
  const tag = node.name;
  if (tag === 'path') {
    node.attributes.d = scalePathData(node.attributes.d, SCALE);
  } else if (tag === 'polyline' || tag === 'polygon') {
    const pts = (node.attributes.points || '').split(/[\s,]+/).filter(Boolean);
    node.attributes.points = pts
      .map((p) => String(Math.round(parseFloat(p) * SCALE * 100) / 100))
      .join(',');
  } else if (scalarAttrs[tag]) {
    for (const attr of scalarAttrs[tag]) {
      if (node.attributes[attr] !== undefined) {
        node.attributes[attr] = String(
          Math.round(parseFloat(node.attributes[attr]) * SCALE * 100) / 100,
        );
      }
    }
  }
  (node.children || []).forEach((child) => scaleElementAttributes(child));
  return node;
}

/* ------------------------------------------------------------------ */
/* Minimal SVG -> JSX conversion (dependency-free)                      */
/* ------------------------------------------------------------------ */

const DRAWING_TAGS = new Set(['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon']);

function elementToJsx(node) {
  const tag = node.name;
  const attrs = Object.entries(node.attributes)
    .filter(
      ([k]) =>
        k !== 'xmlns' && k !== 'version' && k !== 'x' && k !== 'y' && k !== 'width' && k !== 'height' && k !== 'viewBox',
    )
    .map(([k, v]) => {
      if (v === 'currentColor' && (k === 'fill' || k === 'stroke')) {
        return `${k}={iconColor}`;
      }
      return v === '' ? k : `${k}="${v}"`;
    });

  // Monochrome: any drawing primitive without an explicit fill adopts the icon color.
  if (DRAWING_TAGS.has(tag) && node.attributes.fill === undefined) {
    attrs.unshift('fill={iconColor}');
  }

  const children = (node.children || []).map((child) => elementToJsx(child)).join('\n      ');

  // Translate common SVG tags to Blade _Svg primitives
  const tagMap = {
    svg: 'Svg',
    path: 'Path',
    rect: 'Rect',
    circle: 'Circle',
    g: 'G',
    defs: 'Defs',
    clipPath: 'ClipPath',
  };
  const bladeTag = tagMap[tag] || tag;

  if (children) {
    return `<${bladeTag} ${attrs.join(' ')}>\n      ${children}\n    </${bladeTag}>`;
  }
  return `<${bladeTag} ${attrs.join(' ')} />`;
}

/* ------------------------------------------------------------------ */
/* Minimal XML parser (enough for Phosphor SVGs)                        */
/* ------------------------------------------------------------------ */

function parseXmlStrict(xml) {
  const root = { name: 'svg', attributes: {}, children: [] };
  const stack = [root];
  const tokenRe = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;
  let m;
  while ((m = tokenRe.exec(xml)) !== null) {
    const closing = m[1] === '/';
    const name = m[2];
    const attrStr = m[3];
    if (closing) {
      stack.pop();
      continue;
    }
    const selfClosing = attrStr.trim().endsWith('/');
    const cleanAttrs = selfClosing ? attrStr.trim().slice(0, -1) : attrStr;
    const attributes = {};
    const attrRe = /([a-zA-Z:_-]+)\s*=\s*"([^"]*)"/g;
    let am;
    while ((am = attrRe.exec(cleanAttrs)) !== null) {
      attributes[am[1]] = am[2];
    }
    const node = { name, attributes, children: [] };
    const current = stack[stack.length - 1];
    current.children.push(node);
    if (!selfClosing) stack.push(node);
  }
  return root;
}

/* ------------------------------------------------------------------ */
/* Component generation                                                 */
/* ------------------------------------------------------------------ */

const pretty = (s) => s.replace(/\n\s*\n/g, '\n').trim();

function componentSource(name, jsx) {
  return pretty(`import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _${name}: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      ${jsx}
    </Svg>
  );
};

const ${name} = assignWithoutSideEffects(_${name}, {
  componentId: '${name}',
});

export default ${name};
`);
}

async function fetchPhosphor(icon) {
  const weight = icon.weight || 'regular';
  const candidates = [
    `${PHOSPHOR_SRC}/${weight}/${icon.name}.svg`,
    `${PHOSPHOR_SRC}/${weight}/${icon.name}-${weight}.svg`,
  ];
  for (const url of candidates) {
    const res = await fetch(url);
    if (res.ok) return res.text();
  }
  throw new Error(`Failed to fetch Phosphor icon ${icon.name} (${weight})`);
}

async function convert(bladeName, phIcon) {
  const svgText = await fetchPhosphor(phIcon);
  const tree = scaleElementAttributes(parseXmlStrict(svgText));

  // Unwrap the artificial root: the real <svg> is the first child.
  let rootEl = tree;
  if (tree.name === 'svg' && tree.children.length && tree.children[0].name === 'svg') {
    rootEl = tree.children[0];
  }

  const childrenJsx = (rootEl.children || [])
    .map((child) => elementToJsx(child))
    .join('\n  ');

  const dir = path.join(ICONS_DIR, bladeName);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, 'index.ts'), `export { default } from './${bladeName}';\n`);
  fs.writeFileSync(path.join(dir, `${bladeName}.tsx`), componentSource(bladeName, childrenJsx));
  console.log(`converted ${bladeName} -> ${phIcon.name} (${phIcon.weight || 'regular'})`);
}

async function main() {
  for (const bladeName of BATCH) {
    const phIcon = ICON_MAP[bladeName];
    if (!phIcon) {
      console.warn(`SKIP ${bladeName}: no Phosphor mapping`);
      continue;
    }
    const normalized = typeof phIcon === 'string' ? { name: phIcon } : phIcon;
    try {
      await convert(bladeName, normalized);
    } catch (e) {
      console.error(`ERROR ${bladeName}: ${e.message}`);
    }
  }
  console.log('\nDone. Re-run `yarn generate-icons` only if you need iconMap.ts/reexports regenerated.');
}

main();
