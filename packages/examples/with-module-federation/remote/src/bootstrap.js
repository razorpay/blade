import React from 'react';
import ReactDOM from 'react-dom';
import { BladeProvider } from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      <App />
    </BladeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
