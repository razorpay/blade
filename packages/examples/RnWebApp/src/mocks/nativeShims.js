// Stubs for react-native internal modules that don't exist in react-native-web
// Must be a regular function — called both as `fn()` and `new fn()` by RN internals
export default function NativeShimStub() { return null; }
export const PressabilityDebugView = () => null;
export const getRegistrationsByName = () => ({});
export const customDirectEventTypes = {};
