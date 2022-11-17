import dedent from 'dedent';
import type { RecipeSandboxProps, SandboxProps } from './Sandbox.web';
import { BaseText } from '~components/Typography/BaseText';
import { Link } from '~components/Link';

// In React Native, the codesandbox doesn't work. So replacing it with normal text display for native
function Sandbox({ children }: SandboxProps): JSX.Element {
  return <BaseText fontFamily="code">{dedent(children)}</BaseText>;
}

export const RecipeSandbox = (props: RecipeSandboxProps): JSX.Element => {
  const codesandboxURL = `https://codesandbox.io/s/${props.codesandboxId}?file=${props.activeFile}`;
  return <Link href={codesandboxURL}>Open in CodeSandbox</Link>;
};

export default Sandbox;
