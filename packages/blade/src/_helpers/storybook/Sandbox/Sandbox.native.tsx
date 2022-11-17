import dedent from 'dedent';
import type { RecipeSandboxProps, SandboxProps } from './Sandbox.web';
import { BaseText } from '~components/Typography/BaseText';
import { Link } from '~components/Link';

// In React Native, the codesandbox doesn't work. So replacing it with normal text display for native
function Sandbox({ children }: SandboxProps): JSX.Element {
  return <BaseText fontFamily="code">{dedent(children)}</BaseText>;
}

const RecipeSandbox = (props: RecipeSandboxProps): JSX.Element => {
  const codesandboxURL = `https://codesandbox.io/s/${props.codesandboxId}?file=${props.activeFile}`;
  // @ts-expect-error: Link only support `string` type and breaks when we pass a variable
  return <Link href={codesandboxURL}>Open {props.title} Recipe in CodeSandbox</Link>;
};

export { Sandbox, RecipeSandbox };
