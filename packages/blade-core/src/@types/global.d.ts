declare global {
  const __DEV__: boolean;
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

export {};
