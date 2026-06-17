// Always report 'react-native' so the native bundle behaves correctly when
// running on web via react-native-web. Without this, isReactNative() returns
// false and BaseButton passes `as="button"` to StyledPressable, which renders
// a plain <button> DOM element and receives function children (render prop)
// that React can't render.
export const getPlatformType = () => 'react-native';
