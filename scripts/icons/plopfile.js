/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const { stringify, parseSync } = require('svgson');
const { startCase } = require('lodash');
const prettier = require('prettier');

// Absolute paths so the generator behaves the same regardless of the caller's cwd.
const REPO_ROOT = path.resolve(__dirname, '../..');
const REACT_ICONS_DIR = path.join(REPO_ROOT, 'packages/blade/src/components/Icons');
const TEMPLATES_DIR = path.join(__dirname, 'plop');

// Branded icons keep their own colours/gradients and ignore the `color` prop, so they are
// exported but kept out of the generic `iconMap` icon picker (see Icons.stories).
const ICON_MAP_EXCLUDES = ['RazorpayTrustIcon'];

// prettier.format() ignores .prettierrc unless the config is resolved explicitly.
const prettierConfig = prettier.resolveConfig.sync(REPO_ROOT) || {};

const ROOT_ATTRIBUTES = {
  styledProps: '',
  width: '{width}',
  height: '{height}',
  viewBox: '0 0 24 24',
  fill: 'none',
};
const SPREAD_ATTRIBUTE = 'styledProps';
const ICON_COLOR = '{iconColor}';

const transformSvgNode = (node, components = new Set()) => {
  if (node.name === 'svg') {
    node.attributes = { ...ROOT_ATTRIBUTES };
  }

  // title case component names
  node.name = startCase(node.name).replace(/\s/g, '');
  // gather imported components
  components.add(node.name);

  // update iconColor in stroke & fill
  Object.keys(node.attributes).forEach((attribute) => {
    if (['stroke', 'fill'].includes(attribute) && node.attributes[attribute] !== 'none') {
      node.attributes[attribute] = ICON_COLOR;
    }
  });

  // recursively go to child
  if (node.children) node.children.forEach((child) => transformSvgNode(child, components));

  return { node, components };
};

const parseSvg = (svgContents) => {
  let importedComponents = [];
  const svgAst = parseSync(svgContents, {
    camelcase: true,
    transformNode: (transformNode) => {
      const { node, components } = transformSvgNode(transformNode);
      importedComponents = [...components];
      return node;
    },
  });
  return { svgAst, importedComponents };
};

const formatAttribute = (key, value) => {
  if (key === SPREAD_ATTRIBUTE) {
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
    transformAttr: formatAttribute,
  });

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
    actions: () => {
      const allIcons = listIconDirs(REACT_ICONS_DIR);
      const mapIcons = allIcons.filter((icon) => !ICON_MAP_EXCLUDES.includes(icon));
      return [
        {
          type: 'add',
          path: `${REACT_ICONS_DIR}/iconMap.ts`,
          templateFile: `${TEMPLATES_DIR}/iconMap.ts.hbs`,
          data: {
            iconMap: mapIcons.map((icon) => `  ${icon}: ${icon}Component,`).join('\n'),
            iconImports: mapIcons
              .map((icon) => `import ${icon}Component from './${icon}';`)
              .join('\n'),
          },
          force: true,
        },
        {
          type: 'add',
          path: `${REACT_ICONS_DIR}/index.ts`,
          templateFile: `${TEMPLATES_DIR}/iconReexports.ts.hbs`,
          data: {
            iconReexports: allIcons
              .map((icon) => `export { default as ${icon} } from './${icon}';`)
              .join('\n'),
          },
          force: true,
        },
      ];
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
    ],
    actions: (answers) => {
      const { iconName, svgContents } = answers;
      const name = startCase(iconName).trim().replace(/\s/g, '');

      return [
        {
          type: 'addMany',
          templateFiles: `${TEMPLATES_DIR}/icon/**`,
          destination: `${REACT_ICONS_DIR}/{{name}}Icon`,
          base: `${TEMPLATES_DIR}/icon`,
          data: { name },
          abortOnFail: true,
          force: true,
        },
        {
          type: 'modify',
          path: `${REACT_ICONS_DIR}/{{name}}Icon/{{name}}Icon.tsx`,
          data: { name },
          transform(fileContents) {
            const { svgAst, importedComponents } = parseSvg(svgContents);
            const final = fileContents
              .replace(/REPLACE_SVG/g, toJsx(svgAst))
              .replace(/IMPORTED_SVG_COMPONENTS/g, importedComponents.join(', '));

            return prettier.format(final, { ...prettierConfig, parser: 'typescript' });
          },
        },
      ];
    },
  });
};
