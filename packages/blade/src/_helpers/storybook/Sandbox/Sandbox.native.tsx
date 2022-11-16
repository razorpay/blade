import dedent from 'dedent';
import type { RecipeSandboxProps, SandboxProps } from './Sandbox.web';
import { BaseText } from '~components/Typography/BaseText';
import { Text } from '~components/Typography/Text';

// In React Native, the codesandbox doesn't work. So replacing it with normal text display for native
function Sandbox({ children }: SandboxProps): JSX.Element {
  return <BaseText fontFamily="code">{dedent(children)}</BaseText>;
}

export const RecipeSandbox = (_props: RecipeSandboxProps): JSX.Element => {
  // The content and filepaths are null in react native because it can't read files with rawloader like webpack does
  // Added a simple placeholder instead.
  return <Text>Recipes are not supported in React Native. Check on Web Storybook</Text>;
};

export default Sandbox;
