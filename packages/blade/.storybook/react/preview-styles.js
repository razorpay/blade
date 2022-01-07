// src: https://github.com/IgorSzyporyn/storybook-facelift/blob/7a1df9f254/src/styles/manager/managerStyles.ts
/* eslint-disable no-param-reassign */
import { toTitleCase } from '../../src/utils';

const root = `.sb-show-main`;
const previewRoot = `.sb-show-main > #root`;
const docsRoot = `.sb-show-main > #docs-root`;
const docsWrapper = `${docsRoot} > .sbdocs-wrapper`;
const docsContent = `${docsWrapper} > .sbdocs-content`;
// const docsEmptyBlock = `${docs} .docbloc-emptyblock`
const docsParagraph = `${docsContent} .sbdocs-p`;
const docsPreview = `${docsContent} .sbdocs-preview`;
const docsTitle = `${docsContent} .sbdocs-title`;
const docsListItem = `${docsContent} .sbdocs-li`;
const docsh1 = `${docsContent} .sbdocs-h1`;
const docsh2 = `${docsContent} .sbdocs-h2`;
const docsh3 = `${docsContent} .sbdocs-h3`;
const docsh4 = `${docsContent} .sbdocs-h4`;
const docsh5 = `${docsContent} .sbdocs-h5`;
const docsh6 = `${docsContent} .sbdocs-h6`;
const docsText = `${docsContent} .sbdocs-title + div > p`;
// const docsTable = `${docsContent} .docblock-argstable`;
// const docsStory = `${docsContent} .docs-story`;
// const docsStoryContent = `${docsStory} > div:first-of-type`;
// const docsStoryCodeButton = `${docsStory} > div:last-of-type`;

const story = `${docsh2}#stories ~ div`;
const storyPreview = `${story} > .sbdocs-preview`;

export const getPreviewStyles = ({ themeTokens, colorScheme }) => {
  const colorMode = `on${toTitleCase(colorScheme)}`;
  const colors = themeTokens.colors[colorMode];
  const styles = `
  ${root} {
    background-color: ${colors.surface.background.level1.lowContrast};
  }
  ${previewRoot} {
    color: ${colors.surface.text.normal.lowContrast};
  }

  ${docsWrapper} {
    background-color: ${colors.surface.background.level1.lowContrast};
  }

  ${docsWrapper} .sbdocs-preview {
    color: ${colors.surface.text.normal.lowContrast};
  }

  ${docsWrapper} .docblock-emptyblock {
    color: ${colors.surface.text.normal.lowContrast};
    background-color: ${colors.surface.background.level2.lowContrast};
  }

  ${docsTitle} {
    color: ${colors.surface.text.normal.lowContrast};
  }

  ${docsListItem} {
    color: ${colors.surface.text.normal.lowContrast};
  }

  ${docsh1} {
    color: ${colors.surface.text.normal.lowContrast};
    border-bottom-color: ${colors.surface.border.normal.lowContrast};
  }

  ${docsh2} {
    color: ${colors.surface.text.normal.lowContrast};
    border-bottom-color: ${colors.surface.border.normal.lowContrast};
  }

  ${docsh3} {
    color: ${colors.surface.text.normal.lowContrast};
    border-bottom-color: ${colors.surface.border.normal.lowContrast};
  }

  ${docsh4} {
    color: ${colors.surface.text.normal.lowContrast};
    border-bottom-color: ${colors.surface.border.normal.lowContrast};
  }

  ${docsh5} {
    color: ${colors.surface.text.normal.lowContrast};
    border-bottom-color: ${colors.surface.border.normal.lowContrast};
  }

  ${docsh6} {
    color: ${colors.surface.text.normal.lowContrast};
  }

  ${docsText} {
    color: ${colors.surface.text.normal.lowContrast};
  }

  ${docsParagraph} {
    color: ${colors.surface.text.normal.lowContrast};
  }

  ${storyPreview} {
    background-color: ${colors.surface.background.level1.lowContrast};
  }

  ${docsPreview} {
    background-color: ${colors.surface.background.level2.lowContrast};
    };
  }
  `;

  return styles;
};

// export function enhancePreviewStyles({
//   styles,
//   themeVars,
//   themeVariant = 'light',
//   uiParams = {},
//   docsParams = {},
// }: EnhancePreviewStylesProps) {
//   const theme = convert(themeVars)
//   const isDark = themeVariant === 'dark'

//   const buttonStyles = createButtonStyles(theme)
//   const docsTableStyles = createDocsTableStyles(theme, { params: docsParams, isDark })

//   const colors = createPreviewColors(theme, { params: docsParams, isDark })
//   const { color, background } = colors

//   return styles
// }
