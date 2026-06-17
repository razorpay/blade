// Shim for styled-components/native on web.
// The browser version of styled-components doesn't have RN primitive shorthands
// (styled.Text, styled.View, etc.). This shim wraps the browser styled-components
// and adds those shorthands using react-native-web equivalents.
import styled, * as styledExports from 'styled-components';
import { Text, View, TextInput, Pressable, TouchableOpacity } from 'react-native';

function styledNative(component) {
  return styled(component);
}

// Copy all properties from the original styled (attrs, withConfig, etc.)
Object.setPrototypeOf(styledNative, Object.getPrototypeOf(styled));
Object.defineProperties(styledNative, Object.getOwnPropertyDescriptors(styled));

// Add RN primitive shorthands
styledNative.Text = styled(Text);
styledNative.View = styled(View);
styledNative.TextInput = styled(TextInput);
styledNative.Pressable = styled(Pressable);
styledNative.TouchableOpacity = styled(TouchableOpacity);

export default styledNative;
export const { css, keyframes, ThemeProvider, createGlobalStyle, withTheme, useTheme, ServerStyleSheet, StyleSheetManager } = styledExports;
