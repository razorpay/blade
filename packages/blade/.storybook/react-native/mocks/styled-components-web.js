const styledNative = require('styled-components/native');
const { View, Pressable, Text, TextInput, Image } = require('react-native');

const htmlToNativeMap = {
  div: View,
  span: Text,
  p: Text,
  button: Pressable,
  a: Pressable,
  input: TextInput,
  img: Image,
  section: View,
  header: View,
  footer: View,
  nav: View,
  form: View,
  ul: View,
  li: View,
  label: Text,
  h1: Text,
  h2: Text,
  h3: Text,
  h4: Text,
  h5: Text,
  h6: Text,
  table: View,
  tr: View,
  td: View,
  th: View,
};

const styled = styledNative.default || styledNative;

const handler = {
  get(target, prop) {
    if (prop === 'default') {
      return proxiedStyled;
    }
    if (prop in target) {
      return target[prop];
    }
    if (htmlToNativeMap[prop]) {
      return target(htmlToNativeMap[prop]);
    }
    return target(View);
  },
  apply(target, thisArg, args) {
    return target.apply(thisArg, args);
  },
};

const proxiedStyled = new Proxy(styled, handler);

const exportObj = Object.create(proxiedStyled);
exportObj.default = proxiedStyled;
exportObj.useTheme = styledNative.useTheme || (() => ({}));
exportObj.ThemeProvider = styledNative.ThemeProvider;
exportObj.css = styledNative.css || ((...args) => args);
exportObj.keyframes = styledNative.keyframes || (() => '');
exportObj.createGlobalStyle = () => () => null;
exportObj.ServerStyleSheet = class {};
exportObj.__esModule = true;

module.exports = exportObj;
