import { mount } from 'svelte';
import App from './App.svelte';
import './global.css';
// Import CSS variables and utility classes from blade-core
// (split files: light is the base, dark is an additive override — together
// they are equivalent to importing `@razorpay/blade-core/tokens/theme.css`)
import '@razorpay/blade-core/tokens/theme-light.css';
import '@razorpay/blade-core/tokens/theme-dark.css';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
