import { render } from 'preact';

import { App } from './App';
import './styles.css';

const container: HTMLElement | null = document.getElementById('app');
if (container) {
  render(<App />, container);
}
