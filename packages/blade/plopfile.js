var fs = require('fs');
const open = require('open');
const { stringify, parseSync } = require('svgson');
const { startCase } = require('lodash');
const prettier = require('prettier');

const transformSvgNode = (node) => {
  if (node.name === 'svg') {
    node.attributes = {
      width: '{width}',
      height: '{height}',
      viewBox: '0 0 24 24',
      fill: 'none',
    };
  }
  node.name = startCase(node.name);
  if (node.children) node.children.forEach((child) => transformSvgNode(child));

  return node;
};

/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = function (plop) {
  const file = '/tmp/blade-plop-svg.txt';
  fs.writeFileSync(file, '', { encoding: 'utf-8' });

  plop.setActionType('getSvg', function () {
    return new Promise((resolve) => {
      open(file, { wait: true }).then(() => resolve());
    });
  });

  plop.setGenerator('icon', {
    description: 'Generates a icon component',
    prompts: [
      {
        type: 'input',
        name: 'iconName',
        message: 'Enter icon name:',
      },
    ],
    actions: (answers) => {
      const actions = [];

      const { iconName } = answers;
      actions.push({
        type: 'getSvg',
      });

      actions.push({
        type: 'addMany',
        templateFiles: 'plop/icon/**',
        destination: `./src/components/Icons/{{iconName}}Icon`,
        base: 'plop/icon',
        data: { iconName },
        abortOnFail: true,
      });

      actions.push({
        type: 'modify',
        path: 'src/components/Icons/index.tsx',
        pattern: /(\/\/ # append_icon_export)/ig,
        template: 'export { default as {{iconName}}Icon } from \'./{{iconName}}Icon\';\n$1'
      });

      actions.push({
        type: 'modify',
        path: 'src/components/Icons/iconMap.ts',
        pattern: /(\/\/ # append_icon_import)/ig,
        template: 'import {{iconName}}IconComponent from \'./{{iconName}}Icon\';\n$1'
      });

      actions.push({
        type: 'modify',
        path: 'src/components/Icons/iconMap.ts',
        pattern: /(\/\/ # append_icon_map)/ig,
        template: '{{iconName}}Icon: {{iconName}}IconComponent,\r\t$1'
      });

      actions.push({
        type: 'modify',
        path: `src/components/Icons/{{iconName}}Icon/{{iconName}}Icon.tsx`,
        async transform(fileContents, data) {
          let final = fileContents;
          const svgContents = fs.readFileSync(file, { encoding: 'utf-8' });

          const finalJsx = parseSync(svgContents, {
            camelcase: true,
            transformNode: transformSvgNode,
          });

          // replace template svg placeholder
          final = final.replace(
            /REPLACE_SVG/g,
            stringify(finalJsx, {
              selfClose: true,
              // handle jsx props
              transformAttr: (key, value) => {
                if (value.startsWith('{')) {
                  return `${key}=${value}`;
                }
                return `${key}="${value}"`;
              },
            }),
          );

          return prettier.format(final, { parser: 'typescript' });
        },
      });

      return actions;
    },
  });
};
