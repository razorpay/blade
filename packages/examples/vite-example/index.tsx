// @ts-nocheck
import { Button, BladeProvider } from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { createGlobalStyle } from 'styled-components';

// import { BladeProvider, Box } from '@razorpay/blade/components';
// import { paymentTheme, createTheme } from '@razorpay/blade/tokens';

// import App from './App';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//   },
// ]);

// // Only way to load font correctly in sandbpack. Use @fontsource/lato in your actual projects
// document.head.innerHTML += `
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
// `;

// const GlobalStyles = createGlobalStyle`
// * {
//   box-sizing: border-box;
// }
// body {
//   margin: 0;
//   padding: 0;
//   font-family: 'Lato', sans-serif;
// }
// `;

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('root is null');
}
const root = createRoot(rootElement);

// const getTheme = () => {
//   if (false) {
//     return createTheme({
//       brandColor: 'undefined',
//     });
//   }
//   return paymentTheme;
// };

root.render(
  <StrictMode>
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      <Button>Hello world</Button>
    </BladeProvider>
  </StrictMode>,
);

console.clear(); // There could be some codesandbox warnings, clearing them here on init
