import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@razorpay/blade/fonts.css';
import Wrapper from './wrapper/Wrapper';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Wrapper />
    </StrictMode>,
  );
}
