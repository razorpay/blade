import dedent from 'dedent';
import type { SandboxProps } from './Sandbox.web';
import { BaseText } from '~components/Typography/BaseText';

// In React Native, the codesandbox doesn't work. So replacing it with normal text display for native
function Sandbox({ children }: SandboxProps): JSX.Element {
  return <BaseText fontFamily="code">{dedent(children)}</BaseText>;
}

export default Sandbox;
