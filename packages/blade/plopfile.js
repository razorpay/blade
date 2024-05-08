/* eslint-disable prefer-const */
/* eslint-disable import/no-extraneous-dependencies */
const { stringify, parseSync } = require('svgson');
const { startCase } = require('lodash');
const prettier = require('prettier');

const transformSvgNode = (node, components = new Set()) => {
  if (node.name === 'svg') {
    node.attributes = {
      width: '{width}',
      height: '{height}',
      viewBox: '0 0 24 24',
      fill: 'none',
      styledProps: '',
    };
  }

  // title case component names
  node.name = startCase(node.name);
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
  plop.setGenerator('icon', {
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

      // add barell import in index.ts
      // actions.push({
      //   type: 'modify',
      //   path: 'src/components/Icons/index.tsx',
      //   pattern: /(\/\/ # append_icon_export)/gi,
      //   template: "export { default as {{name}}Icon } from './{{name}}Icon';\n$1",
      // });

      // // modify iconMap imports
      // actions.push({
      //   type: 'modify',
      //   path: 'src/components/Icons/iconMap.ts',
      //   pattern: /(\/\/ # append_icon_import)/gi,
      //   template: "import {{name}}IconComponent from './{{name}}Icon';\n$1",
      // });

      // // modify iconMap map
      // actions.push({
      //   type: 'modify',
      //   path: 'src/components/Icons/iconMap.ts',
      //   pattern: /(\/\/ # append_icon_map)/gi,
      //   template: '{{name}}Icon: {{name}}IconComponent,\r\t$1',
      // });

      // modify svg -> jsx
      actions.push({
        type: 'modify',
        path: `src/components/Icons/{{name}}Icon/{{name}}Icon.tsx`,
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
