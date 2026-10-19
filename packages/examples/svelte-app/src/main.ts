import { mount } from 'svelte';
// Blade's plain stylesheet (opacity steps, the Tasa and Inter faces), and
// the classes UnoCSS generates from Blade's config and the app's markup.
import '@razorpay/blade-svelte/blade.css';
import 'virtual:uno.css';
// The page defaults Blade leaves to the app: base font, box model.
import './app.css';
import App from './App.svelte';

mount(App, { target: document.getElementById('app')! });
