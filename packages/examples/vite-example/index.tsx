import { BladeProvider } from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('root is null');
}
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      <App />
    </BladeProvider>
  </StrictMode>,
);

console.clear();
