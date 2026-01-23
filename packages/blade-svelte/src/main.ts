import { mount } from 'svelte';
import App from './App.svelte';
import './global.css';
// Import CSS variables and utility classes from blade-core
import '@razorpay/blade-core/tokens/theme.css';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
