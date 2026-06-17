// Re-export everything react-native-web provides (no default export — it uses named exports only)
export * from 'react-native-web';

// Stub native-only APIs that react-native-web doesn't implement
export const TurboModuleRegistry = {
  get: () => null,
  getEnforcing: () => ({}),
};

export const DrawerLayoutAndroid = () => null;
