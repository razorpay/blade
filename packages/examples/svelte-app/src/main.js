import { mount } from 'svelte';
import App from './App.svelte';
import '@razorpay/blade-core/tokens/theme.css';
import '@razorpay/blade-core/styles.css';

const app = mount(App, {
  target: document.getElementById('app'),
});

export default app;
