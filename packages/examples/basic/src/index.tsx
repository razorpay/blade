import * as ReactDOMClient from 'react-dom/client';

import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('root is null');
}

const root = ReactDOMClient.createRoot(rootElement);

root.render(<App />);
