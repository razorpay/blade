import dedent from 'dedent';
import type { CodeViewerProps } from '@codesandbox/sandpack-react';
import { ScrollView } from 'react-native';
import type { RecipeSandboxProps, SandboxProps } from './types';
import { BaseText } from '~components/Typography/BaseText';
import { Link } from '~components/Link';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';

// In React Native, the codesandbox doesn't work. So replacing it with normal text display for native
function Sandbox({ children, uri }: SandboxProps): JSX.Element {
  return (
    <ScrollView>
      {uri ? <Link href={uri}>Open Story in Web</Link> : null}
      <BaseText marginTop="spacing.5" fontFamily="code">
        {dedent(children)}
      </BaseText>
    </ScrollView>
  );
}

function SandboxHighlighter({ children }: { children: string } & CodeViewerProps): JSX.Element {
  return <BaseText fontFamily="code">{dedent(children)}</BaseText>;
}

const VerticalSandbox = ({
  code,
  minHeight,
}: {
  code: string;
  minHeight?: `${string}px`;
}): JSX.Element => {
  return (
    <BaseBox minHeight={minHeight}>
      <Sandbox>{code}</Sandbox>
    </BaseBox>
  );
};

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

export { Sandbox, SandboxProvider, SandboxHighlighter, RecipeSandbox, VerticalSandbox };
