import React from 'react';
import { createRoot } from 'react-dom/client';
import { BladeGenUIApp } from './App';
import './styles.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

createRoot(container).render(<BladeGenUIApp />);
