import dedent from 'dedent';
import type { SandboxProps } from './Sandbox.web';
import { Text } from '~components/Typography';

// In React Native, the codesandbox doesn't work. So replacing it with normal text display for native
function Sandbox({ children }: SandboxProps): JSX.Element {
  return <Text>{dedent(children)}</Text>;
}

export default Sandbox;
