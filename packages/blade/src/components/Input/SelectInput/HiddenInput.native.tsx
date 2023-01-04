// We don't need HiddenInput in React Native so we render nothing
// Giving any to avoid typecheck errors on react native
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HiddenInput = (_props: any): null => null;

export { HiddenInput };
