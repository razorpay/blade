import { toTitleCase } from '../../src/utils';

export const root = `.os-host`;
export const body = `body`;
export const rootId = `#root`;
export const topBar = `.os-content`;
export const mainRoot = `${rootId} > div > div[role=main] > div`;
export const sideBar = `.sidebar-container`;
export const sidebarItem = `.sidebar-item`;
export const sidebarHeading = `${rootId} .sidebar-header`;
export const sidebarSubHeading = `${rootId} .sidebar-subheading`;
export const sidebarForm = `${sidebarHeading} + form`;
export const sidebarMenu = `${sidebarForm} + div`;
export const menuHeader = `${sidebarMenu} .sidebar-subheading`;
export const menuItem = `${sidebarMenu} .sidebar-item`;
export const menuItemSelected = `${sidebarMenu} .sidebar-item.selected`;
export const menuItemExpander = `${menuItem} .sidebar-expander`;
export const menuIcon = `${menuItem} .sidebar-svg-icon`;
export const menuItemIcon = `${menuItem} .sidebar-expander + .sidebar-svg-icon`;
export const menuItemTitle = `${menuItem} .sidebar-expander + .sidebar-svg-icon + span`;
export const menuSubitem = `${sidebarMenu} > div > section > div > .sidebar-item`;
export const menuItemIconSelected = `${menuItemSelected} .sidebar-svg-icon`;
export const menuItemTitleSelected = `${menuItemSelected} .sidebar-svg-icon + span`;
export const modalMenu = `body > div:last-child`;

// function getHeaderColors(theme: StorybookTheme, isDark: boolean) {
//   let baseColor = theme.color.defaultText;

//   const contrastRatio = getContrastRatio(baseColor, theme.background.app);

//   if (contrastRatio < 3) {
//     baseColor = bestContrastColor({
//       color1: theme.color.defaultText,
//       background: theme.background.app,
//       ratio: 3.5,
//     });
//   }

//   const actionColor = setColorOpacity(baseColor, isDark ? 0.4 : 0.35);
//   const actionColorHover = setColorOpacity(baseColor, 0.7);

//   const borderColor = setColorOpacity(baseColor, isDark ? 0.1 : 0.1);

//   return {
//     title: baseColor,
//     action: actionColor,
//     actionActive: actionColorHover,
//     border: borderColor,
//   };
// }

// function getMenuItemColorSelected(theme) {
//   let color = '#ffffff';

//   const contrastRatio = getContrastRatio(color, theme.color.secondary);

//   if (contrastRatio < 2.62) {
//     color = bestContrastColor({
//       color1: '#ffffff',
//       color2: '#000000',
//       background: theme.color.secondary,
//       ratio: 7,
//     });
//   }

//   return color;
// }

// function getMenuSubitemIconColor(theme) {
//   let color = theme.color.primary;

//   const contrastRatio = getContrastRatio(color, theme.background.app);

//   if (contrastRatio < 2.62) {
//     color = bestContrastColor({
//       color1: theme.color.primary,
//       background: theme.background.app,
//       ratio: 4,
//     });
//   }

//   return color;
// }

// function getMenuItemColor(theme: StorybookTheme) {
//   let color = theme.color.defaultText;

//   const contrastRatio = getContrastRatio(color, theme.background.app);

//   if (contrastRatio < 3) {
//     color = bestContrastColor({
//       color1: theme.color.defaultText,
//       background: theme.background.app,
//       ratio: 3.5,
//     });
//   }

//   return color;
// }

// function getMainShadow(ui: ParamUi) {
//   const elevation: ParamUiElevationTypes = ui.elevation !== undefined ? ui.elevation : 1;
//   const shadow = elevationMap[elevation];

//   return shadow;
// }

// function getMenuHeaderColor(theme: StorybookTheme, isDark: boolean) {
//   const color = bestContrastColor({
//     color1: isDark ? '#ffffff' : '#000000',
//     background: theme.background.app,
//     ratio: 4.5,
//   });

//   return color;
// }

// function getMenuIconColor(_color: string, theme: StorybookTheme) {
//   let color = _color;
//   const contrastRatio = getContrastRatio(color, theme.background.app);

//   if (contrastRatio < 3) {
//     color = bestContrastColor({
//       color1: theme.color.secondary,
//       background: theme.background.app,
//       ratio: 3,
//     });
//   }

//   return color;
// }

// export function enhanceManagerStyles({
//   styles,
//   themeVars,
//   themeVariant = 'light',
//   uiParams = {}
// }: EnhanceManagerStylesProps) {
//   const isDark = themeVariant === 'dark';
//   const theme = convert(themeVars);

//   const mainShadow = getMainShadow(uiParams);

//   const menuHeaderColor = getMenuHeaderColor(theme, isDark);
//   const menuIconColor = getMenuIconColor(theme.color.secondary, theme);
//   const menuItemColor = getMenuItemColor(theme);
//   const menuItemColorSelected = getMenuItemColorSelected(theme);
//   const menuSubitemIconColor = getMenuSubitemIconColor(theme);

//   const headerColors = getHeaderColors(theme, isDark);
//   return styles;
// }

export const getManagerStyles = ({ themeTokens, colorScheme }) => {
  const colorMode = `on${toTitleCase(colorScheme)}`;
  const colors = themeTokens.colors[colorMode];
  const styles = `
  ${body}, ${root} {
    color: ${colors.surface.text.normal.lowContrast};
    background-color: ${colors.surface.background.level1.lowContrast};
  }

  ${topBar} {
    color: ${colors.surface.text.normal.lowContrast};
  }
  ${topBar} button {
    border-bottom-width: 0px;
  }
  ${topBar} button:hover {
    color: ${colors.brand.primary[500]};
  }
  ${topBar} a button {
    color: ${colors.surface.text.normal.lowContrast};
    border-bottom-width: 0px;
  }
  ${topBar} a button:hover {
    color: ${colors.brand.primary[500]};
  }
  ${sidebarHeading} a {
    color: ${colors.surface.text.normal.lowContrast};
  }
  ${sidebarHeading} button {
    box-shadow: '${colors.action.background.tertiary.default} 0 0 0 1px inset';
  }
  ${sidebarHeading} button:hover {
    box-shadow: '${colors.action.background.tertiary.hover} 0 0 0 1px inset';
  }

  ${sidebarHeading} button svg path {
    fill: ${colors.surface.text.subdued.lowContrast};
  }
  ${sidebarHeading} button svg path:hover {
    fill: ${colors.action.background.secondary.default};
  }

  ${sidebarForm} input[type="text"] {
    border-bottom: '1px solid ${colors.surface.text.normal.lowContrast}';
  }

  ${sidebarForm} input[type="text"]::placeholder {
    color: ${colors.surface.text.normal.lowContrast};
  }
  
  ${sidebarForm} input[type="text"]:active {
    border-bottom: '1px solid ${colors.surface.border.normal.lowContrast}';
  }

  ${sidebarForm} input[type="text"]:focus {
    border-bottom: '1px solid ${colors.surface.border.normal.lowContrast}';
  }

  ${sidebarForm} input[type="text"]:active + svg {
    color: ${colors.surface.border.normal.lowContrast};
  }
  ${sidebarForm} input[type="text"]:focus + svg {
    color: ${colors.surface.border.normal.lowContrast};
  }

  ${sidebarForm} input[type="text"] + svg {
    color: ${colors.surface.text.normal.lowContrast};
  }

  ${menuHeader} {
    color: ${colors.surface.text.subtle.lowContrast};
  }

  ${menuIcon} {
    color: ${colors.surface.text.subtle.lowContrast};
  }

  ${menuItemTitle} {
    color: ${colors.surface.text.subtle.lowContrast};
  }

  ${menuSubitem} .sidebar-svg-icon {
      color: ${colors.surface.text.subtle.lowContrast}
  }

  ${menuItemIconSelected} {
    color: ${colors.brand.primary[300]};
  }

  ${menuItemTitleSelected} {
    color: ${colors.brand.primary[300]};
  }

  ${mainRoot} {
    background-color: ${colors.surface.background.level1.lowContrast};
  }
  ${mainRoot} > div:nth-of-type(2) {
    border-left-color: ${colors.surface.border.normal.lowContrast};
    border-top-color: ${colors.surface.border.normal.lowContrast};
  }
  ${mainRoot} > div:nth-of-type(2) #storybook-panel-root > #panel-tab-content > div:last-of-type {
    background-color: ${colors.surface.background.level1.lowContrast};
  }

  ${mainRoot} > div:nth-of-type(2) #storybook-panel-root > #panel-tab-content > div:last-of-type .docblock-argstable {
    background-color: 'docstableargs';
  }

  ${modalMenu} {
    background: ${colors.surface.background.level1.lowContrast};
  }

  ${sidebarSubHeading} {
    color: ${colors.surface.text.subdued.lowContrast};
  }
  
  ${sidebarItem} {
    color: ${colors.surface.text.normal.lowContrast};
  }

  ${sidebarItem}[data-selected="true"] {
    background-color: ${colors.brand.primary[500]};
  }
  ${sidebarItem}:hover {
    background-color: ${colors.brand.gray[400]};
  }
  `;
  return styles;
};
