// Ambient module and element declarations: a reference, not an import.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./assets.d.ts" />
// The cx component set. Not a package entry: `./components-entry.ts` publishes
// it as `@razorpay/blade-svelte/components`. Stories and tests import it.
export * from './components';
