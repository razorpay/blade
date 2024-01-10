/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
import setValue from '../utils/setValue';
import showNotification from './showNotification';
/**
 * @TODO:
 * append globalColors key
 * convert the dot to square braces for values of object
 * here's the regex - console.log('chromatic.azure.a50'.replace(regex, (m,s)=> {console.log({m,s}); return `[${m.replace('.','')}]`; }));
 * 'chromatic.azure.50'.replace(/\.[0-9]+/, (matchedString)=> `[${matchedString.replace('.','')}]`)
 * commit to blade
 * create a UI to input GitHub PAT
 */

const makeThemeColorTokens = (figma: any): void => {
  const paymentThemeColors = {};
  const bankingThemeColors = {};
  const makeColorObject = ({ node, themeName, themeKey }: any): void => {
    try {
      if (themeName && themeKey) {
        // at this point we are sure that if we have themeKey and themeName then we are reaching towards our actual theme construction
        if (node.children) {
          node.children.forEach((child: any) => {
            if (
              child.type === 'TEXT' &&
              (child.characters.includes('neutral') || child.characters.includes('chromatic'))
            ) {
              // we have finally got our value so set it
              const tokenValue = `globalColors.${child.characters
                // .replace(/\.(0)+?(0)*?/g, '.') // replace `00` with `0`
                .replace('.0', '.')
                .replace('.0', '.') // replace `00` with `0`
                .replace(
                  /\.[0-9]+/,
                  (matchedString: any) => `[${matchedString.replace('.', '')}]`,
                )}`;
              if (themeName === 'payment') {
                setValue(paymentThemeColors, themeKey.replace('theme.', ''), tokenValue);
              } else if (themeName === 'banking') {
                setValue(bankingThemeColors, themeKey.replace('theme.', ''), tokenValue);
              }
            } else if (
              child.type === 'INSTANCE' &&
              (child.name === 'onDark' || child.name === 'onLight')
            ) {
              makeColorObject({
                node: child,
                themeName,
                themeKey: themeKey.replace('theme.colors', `theme.colors.${child.name}`),
              });
            } else {
              makeColorObject({ node: child, themeName, themeKey });
            }
          });
        }
      } else if (node.type === 'TEXT' && node.characters.includes('theme.colors')) {
        // if we have reached a text node whose content starts with `theme.colors` then essentially we have got the theme key
        // So based on the structure of our Figma we go to the parent node of `theme.colors` and then check it's `info` frame and then resume recursion there
        // while doing so we also add 2 additional keys, themeName and themeKey because they are sibling nodes and we need `theme.colors` info and their theme name while creating the object
        const themeKey = node.characters;
        node.parent.children
          .find((child: any) => child.type === 'FRAME')
          .children.forEach((child: any) => {
            if (child.name === 'banking') {
              makeColorObject({ node: child, themeName: 'banking', themeKey });
            } else if (child.name === 'payment') {
              makeColorObject({ node: child, themeName: 'payment', themeKey });
            }
          });
      } else if (
        ['FRAME'].includes(node.type) &&
        node.children &&
        node.name !== 'title' &&
        node.name !== 'info'
      ) {
        // the first iteration starts from here. We'll recurse until we have parsed the whole tree
        node.children.forEach((child: any) => {
          makeColorObject({ node: child });
        });
      }
    } catch (error: any) {
      console.error('error', error);
      showNotification({
        figma,
        type: 'error',
        text: `⛔️ Something went wrong: ${error} `,
      });
    }
  };

  const colorTokenNodes = figma.currentPage.selection[0].children
    .find((currentSelection: any) => currentSelection.name === 'content')
    ?.children.find((content: any) => content.name === 'Body')
    ?.children.find((body: any) => body.name === 'Table Body');

  if (colorTokenNodes) {
    makeColorObject({ node: colorTokenNodes });
    showNotification({
      figma,
      type: 'information',
      text: '✅ Theme color tokens created!',
    });
    figma.ui.postMessage({
      type: 'export-theme-color-tokens',
      data: { paymentThemeColors, bankingThemeColors },
    });
    console.log({ paymentThemeColors, bankingThemeColors });
    figma.ui.show();
  } else {
    showNotification({
      figma,
      type: 'error',
      text:
        '⛔️ Oops no Color Tokens found in selection! Make sure to select a correct PAGE with Color Tokens!',
    });
  }
};

export default makeThemeColorTokens;
