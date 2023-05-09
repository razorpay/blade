import dedent from 'dedent';
import type { CodeViewerProps } from '@codesandbox/sandpack-react';
import type { RecipeSandboxProps, SandboxProps } from './Sandbox.web';
import { BaseText } from '~components/Typography/BaseText';
import { Link } from '~components/Link';
import { Text } from '~components/Typography';

// In React Native, the codesandbox doesn't work. So replacing it with normal text display for native
function Sandbox({ children }: SandboxProps): JSX.Element {
  return <BaseText fontFamily="code">{dedent(children)}</BaseText>;
}

function SandboxHighlighter({ children }: { children: string } & CodeViewerProps): JSX.Element {
  return <BaseText fontFamily="code">{dedent(children)}</BaseText>;
}

function SandboxProvider(_props: {
  children: React.ReactNode;
  code: string;
  border?: string;
}): JSX.Element {
  return <Text>Not supported in React Native</Text>;
}

const RecipeSandbox = (props: RecipeSandboxProps): JSX.Element => {
  const codesandboxURL = `https://codesandbox.io/s/${props.codesandboxId}?file=${props.activeFile}`;
  return <Link href={codesandboxURL}>Open in CodeSandbox</Link>;
};

export { Sandbox, SandboxProvider, SandboxHighlighter, RecipeSandbox };
