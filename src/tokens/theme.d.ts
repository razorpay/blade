// This file exists for two purposes:
// 1. Ensure that both ios and android files present identical types to importers.
// 2. Allow consumers to import the module as if typescript understood react-native suffixes.
// import DefaultNative from './theme.native';
// import * as native from './theme.native';
// import DefaultWeb from './theme.web';
// import * as web from './theme.web';

// export * from './theme.native';
// export * from './theme.web';

import defaultTheme from './theme.web';
// type defaultTheme = {
//   fonts: {
//     family: {
//       lato: {
//         regular: string;
//         bold: string;
//         light: string;
//       };
//     };
//     size: {
//       xxsmall: string;
//       xsmall: string;
//       small: string;
//       medium: string;
//       large: string;
//       xlarge: string;
//       xxlarge: string;
//       xxxlarge: string;
//       xxxxlarge: string;
//     };
//     weight: any
//     lineHeight: any
//     letterSpacing: any
//   };
//   spacings: any
//   colors: any
// }
export default defaultTheme
export * from './theme.web';