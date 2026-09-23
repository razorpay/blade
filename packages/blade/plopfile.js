/* eslint-disable prefer-const */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const { stringify, parseSync } = require('svgson');
const { startCase } = require('lodash');
const prettier = require('prettier');

const SVELTE_ICONS_DIR = '../blade-svelte/src/components/Icons';
const REACT_ICONS_DIR = './src/components/Icons';

// Branded icons keep their own colours/gradients and ignore the `color` prop, so they are
// exported but kept out of the generic `iconMap` icon picker (see Icons.stories).
const ICON_MAP_EXCLUDES = ['RazorpayTrustIcon'];

// prettier.format() ignores .prettierrc unless the config is resolved explicitly.
const prettierConfig = prettier.resolveConfig.sync(__dirname) || {};

// Per-framework differences in the emitted markup. Everything else (title-cased
// primitive names, colour rewriting, structure) is shared.
const TARGETS = {
  react: {
    rootAttributes: {
      styledProps: '',
      width: '{width}',
      height: '{height}',
      viewBox: '0 0 24 24',
      fill: 'none',
    },
    spreadAttribute: 'styledProps',
    iconColor: '{iconColor}',
  },
  svelte: {
    rootAttributes: {
      width: '{iconProps.width}',
      height: '{iconProps.height}',
      viewBox: '0 0 24 24',
      rest: '',
    },
    spreadAttribute: 'rest',
    iconColor: '{iconProps.iconColor}',
  },
};

const resolveTargets = (target = 'all') => (target === 'all' ? ['react', 'svelte'] : [target]);

const transformSvgNode = (node, target, components = new Set()) => {
  const config = TARGETS[target];
  if (node.name === 'svg') {
    node.attributes = { ...config.rootAttributes };
  }

  // title case component names
  node.name = startCase(node.name).replace(/\s/g, '');
  // gather imported components
  components.add(node.name);

  // update iconColor in stroke & fill
  Object.keys(node.attributes).forEach((attribute) => {
    if (['stroke', 'fill'].includes(attribute) && node.attributes[attribute] !== 'none') {
      node.attributes[attribute] = config.iconColor;
    }
  });

  // recursively go to child
  if (node.children) node.children.forEach((child) => transformSvgNode(child, target, components));

  return { node, components };
};

const parseSvg = (svgContents, target) => {
  let importedComponents = [];
  const svgAst = parseSync(svgContents, {
    camelcase: true,
    transformNode: (transformNode) => {
      const { node, components } = transformSvgNode(transformNode, target);
      importedComponents = [...components];
      return node;
    },
  });
  return { svgAst, importedComponents };
};

const formatAttribute = (key, value, spreadAttribute) => {
  if (key === spreadAttribute) {
    return `{...${key}}`;
  }
  if (value.startsWith('{')) {
    return `${key}=${value}`;
  }
  return `${key}="${value}"`;
};

const toJsx = (svgAst) =>
  stringify(svgAst, {
    selfClose: true,
    transformAttr: (key, value) => formatAttribute(key, value, TARGETS.react.spreadAttribute),
  });

// Hand-rolled printer so the svelte output is prettier-shaped without pulling
// prettier-plugin-svelte into the repo (root prettier is pinned to 2.x).
const toSvelteMarkup = (node, depth = 0) => {
  const pad = '  '.repeat(depth);
  const attrs = Object.entries(node.attributes).map(([key, value]) =>
    formatAttribute(key, value, TARGETS.svelte.spreadAttribute),
  );
  const children = (node.children || []).filter((child) => child.type === 'element');
  const inline = `${pad}<${node.name}${attrs.map((attr) => ` ${attr}`).join('')}`;
  const fitsOnOneLine = inline.length + 3 <= 100;
  const open = fitsOnOneLine
    ? `${inline}${children.length === 0 ? ' ' : ''}`
    : `${pad}<${node.name}\n${attrs.map((attr) => `${pad}  ${attr}`).join('\n')}\n${pad}`;
  if (children.length === 0) {
    return `${open}/>`;
  }
  const body = children.map((child) => toSvelteMarkup(child, depth + 1)).join('\n');
  return `${open}>\n${body}\n${pad}</${node.name}>`;
};

const listIconDirs = (iconsFolder) =>
  fs
    .readdirSync(iconsFolder)
    .filter((icon) => {
      if (!fs.statSync(path.join(iconsFolder, icon)).isDirectory()) return false;
      if (fs.readdirSync(path.join(iconsFolder, icon)).length === 0) return false;
      return icon.endsWith('Icon');
    })
    .sort();

/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = (plop) => {
  plop.setGenerator('generate-reexports', {
    description: 'Generates re-exports for all icon components',
    prompts: [],
    actions: (answers = {}) => {
      const actions = [];
      const targets = resolveTargets(answers.target);

      if (targets.includes('react')) {
        const allIcons = listIconDirs(REACT_ICONS_DIR);
        const mapIcons = allIcons.filter((icon) => !ICON_MAP_EXCLUDES.includes(icon));
        actions.push({
          type: 'add',
          path: `${REACT_ICONS_DIR}/iconMap.ts`,
          templateFile: 'plop/iconMap.ts.hbs',
          data: {
            iconMap: mapIcons.map((icon) => `  ${icon}: ${icon}Component,`).join('\n'),
            iconImports: mapIcons
              .map((icon) => `import ${icon}Component from './${icon}';`)
              .join('\n'),
          },
          force: true,
        });
        actions.push({
          type: 'add',
          path: `${REACT_ICONS_DIR}/index.ts`,
          templateFile: 'plop/iconReexports.ts.hbs',
          data: {
            iconReexports: allIcons
              .map((icon) => `export { default as ${icon} } from './${icon}';`)
              .join('\n'),
          },
          force: true,
        });
      }

      if (targets.includes('svelte')) {
        // Directory scan also picks up hand-written icons (RazorpayTrustIcon), same as React.
        const allIcons = listIconDirs(SVELTE_ICONS_DIR);
        const mapIcons = allIcons.filter((icon) => !ICON_MAP_EXCLUDES.includes(icon));
        actions.push({
          type: 'add',
          path: `${SVELTE_ICONS_DIR}/iconMap.ts`,
          templateFile: 'plop/iconMap.svelte.ts.hbs',
          data: {
            iconMap: mapIcons.map((icon) => `  ${icon},`).join('\n'),
            iconImports: mapIcons.map((icon) => `import { ${icon} } from './${icon}';`).join('\n'),
          },
          force: true,
        });
        actions.push({
          type: 'add',
          path: `${SVELTE_ICONS_DIR}/index.ts`,
          templateFile: 'plop/iconReexports.svelte.ts.hbs',
          data: {
            iconReexports: allIcons
              .map((icon) => `export { ${icon} } from './${icon}';`)
              .join('\n'),
          },
          force: true,
        });
      }

      return actions;
    },
  });

  plop.setGenerator('generate-icons', {
    description: 'Generates a icon component',
    prompts: [
      {
        type: 'input',
        name: 'iconName',
        message: 'Enter icon name:',
      },
      {
        type: 'input',
        name: 'svgContents',
        message: 'Paste svg contents:',
        validate: (value) => !!value,
      },
      {
        type: 'list',
        name: 'target',
        message: 'Target framework:',
        choices: ['all', 'react', 'svelte'],
        default: 'all',
      },
    ],
    actions: (answers) => {
      const actions = [];

      let { iconName, svgContents } = answers;
      const targets = resolveTargets(answers.target);

      let name = startCase(iconName).trim().replace(/\s/g, '');

      if (targets.includes('react')) {
        actions.push({
          type: 'addMany',
          templateFiles: 'plop/icon/**',
          destination: `${REACT_ICONS_DIR}/{{name}}Icon`,
          base: 'plop/icon',
          data: { name },
          abortOnFail: true,
          force: true,
        });

        actions.push({
          type: 'modify',
          path: `${REACT_ICONS_DIR}/{{name}}Icon/{{name}}Icon.tsx`,
          data: { name },
          transform(fileContents) {
            const { svgAst, importedComponents } = parseSvg(svgContents, 'react');
            const final = fileContents
              .replace(/REPLACE_SVG/g, toJsx(svgAst))
              .replace(/IMPORTED_SVG_COMPONENTS/g, importedComponents.join(', '));

            return prettier.format(final, { ...prettierConfig, parser: 'typescript' });
          },
        });
      }

      if (targets.includes('svelte')) {
        actions.push({
          type: 'addMany',
          templateFiles: 'plop/icon-svelte/**',
          destination: `${SVELTE_ICONS_DIR}/{{name}}Icon`,
          base: 'plop/icon-svelte',
          data: { name },
          abortOnFail: true,
          force: true,
        });

        actions.push({
          type: 'modify',
          path: `${SVELTE_ICONS_DIR}/{{name}}Icon/{{name}}Icon.svelte`,
          data: { name },
          transform(fileContents) {
            const { svgAst, importedComponents } = parseSvg(svgContents, 'svelte');
            return fileContents
              .replace(/REPLACE_SVG/g, toSvelteMarkup(svgAst))
              .replace(/IMPORTED_SVG_COMPONENTS/g, importedComponents.join(', '));
          },
        });
      }

      return actions;
    },
  });
};
