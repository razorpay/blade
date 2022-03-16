/** Setup the React Native globals to differentiate between a web and react native app.
 * For browser we have `window`, for node we have `process` as globals, for React Native it's `global.navigator.product: ReactNative`
 **/
Object.defineProperty(global.navigator, 'product', {
  value: 'ReactNative',
});
