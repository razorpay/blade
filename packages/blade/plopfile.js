/* eslint-disable prefer-const */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const { stringify, parseSync } = require('svgson');
const { startCase } = require('lodash');
const prettier = require('prettier');

const transformSvgNode = (node, components = new Set()) => {
  if (node.name === 'svg') {
    node.attributes = {
      styledProps: '',
      width: '{width}',
      height: '{height}',
      viewBox: '0 0 24 24',
      fill: 'none',
    };
  }

  // title case component names
  node.name = startCase(node.name).replace(/\s/g, '');
  // gather imported components
  components.add(node.name);

  // update iconColor in stroke & fill
  Object.keys(node.attributes).forEach((attribute) => {
    if (['stroke', 'fill'].includes(attribute) && node.attributes[attribute] !== 'none') {
      node.attributes[attribute] = `{iconColor}`;
    }
  });

  // recursively go to child
  if (node.children) node.children.forEach((child) => transformSvgNode(child, components));

  return { node, components };
};

/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = (plop) => {
  plop.setGenerator('generate-reexports', {
    description: 'Generates re-exports for all icon components',
    prompts: [],
    actions: () => {
      const actions = [];

      // get all icon components
      const iconsFolder = './src/components/Icons';
      const icons = fs.readdirSync(iconsFolder);
      const allIcons = icons
        .map((icon) => {
          if (!fs.statSync(`${iconsFolder}/${icon}`).isDirectory()) return null;
          const files = fs.readdirSync(`${iconsFolder}/${icon}`);
          if (files.length === 0) return null;
          if (icon.endsWith('Icon')) {
            return icon;
          }
          return null;
        })
        .filter(Boolean)
        .sort();

      const imports = allIcons
        .map((icon) => {
          return `import ${icon}Component from './${icon}';`;
        })
        .join('\n');

      const map = allIcons
        .map((icon) => {
          return `  ${icon}: ${icon}Component,`;
        })
        .join('\n');

      const reexports = allIcons
        .map((icon) => {
          return `export { default as ${icon} } from './${icon}';`;
        })
        .join('\n');

      actions.push({
        type: 'add',
        path: './src/components/Icons/iconMap.ts',
        templateFile: 'plop/iconMap.ts.hbs',
        data: {
          iconMap: map,
          iconImports: imports,
        },
        force: true,
      });

      actions.push({
        type: 'add',
        path: './src/components/Icons/index.ts',
        templateFile: 'plop/iconReexports.ts.hbs',
        data: {
          iconReexports: reexports,
        },
        force: true,
      });

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
    ],
    actions: (answers) => {
      const actions = [];

      let { iconName, svgContents } = answers;

      let name = startCase(iconName).trim().replace(/\s/g, '');
      // populate the template code
      actions.push({
        type: 'addMany',
        templateFiles: 'plop/icon/**',
        destination: `./src/components/Icons/{{name}}Icon`,
        base: 'plop/icon',
        data: { name },
        abortOnFail: true,
        force: true,
      });

      // modify svg -> jsx
      actions.push({
        type: 'modify',
        path: `./src/components/Icons/{{name}}Icon/{{name}}Icon.tsx`,
        data: { name },
        transform(fileContents) {
          let final = fileContents;
          let importedComponents = [];

          // parse svg contents to ast and modify the ast with transformSvgNode
          const svgAst = parseSync(svgContents, {
            camelcase: true,
            // transform each node and gather imported components
            transformNode: (transformNode) => {
              const { node, components } = transformSvgNode(transformNode);
              importedComponents = [...components];
              return node;
            },
          });

          // stringify svg ast
          const svgString = stringify(svgAst, {
            selfClose: true,
            // transform jsx props
            transformAttr: (key, value) => {
              if (key === 'styledProps') {
                return '{...styledProps}';
              }
              if (value.startsWith('{')) {
                return `${key}=${value}`;
              }
              return `${key}="${value}"`;
            },
          });

          // replace template svg placeholder
          final = final.replace(/REPLACE_SVG/g, svgString);
          // update imported svg components
          final = final.replace(/IMPORTED_SVG_COMPONENTS/g, importedComponents.join(', '));

          return prettier.format(final, {
            parser: 'typescript',
            singleQuote: true,
          });
        },
      });

      return actions;
    },
  });
};
