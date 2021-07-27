// import './App.css';
import React from 'react';
import { ThemeProvider } from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';
import { createGlobalStyle } from 'styled-components';
// import logo from './logo.svg';
import Card from './Card';
import '@fontsource/lato';

const GlobalStyle = createGlobalStyle`
html {
  box-sizing: border-box;
}
body {
    margin: 16px;
    font-family: ${paymentTheme.typography.desktop.fonts.family.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${paymentTheme.colors.surface.background.level1.lowContrast.onLight};
  }
`;

function App(): JSX.Element {
  return (
    <React.Fragment>
      <GlobalStyle />
      <ThemeProvider theme={paymentTheme}>
        <Card />
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
