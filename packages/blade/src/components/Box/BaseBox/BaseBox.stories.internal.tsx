// @TODO: test story. Remove later
import type { Meta } from '@storybook/react';
import type { BaseBoxProps } from './types';
import { BaseBox } from '.';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { Text } from '~components/Typography';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';

const BoxStoryMeta = {
  title: 'Components/Box/BaseBox (Internal)',
  component: BaseBox,
  argTypes: {
    padding: {
      name: 'padding',
      description:
        'Can be \n\n - an absolute value like `10px` \n\n - token `"spacing.5"`\n\n - an array shorthand `["spacing.2", "10px", "spacing.5", "spacing.9"]`\n\n - responsive object with combinatation of all previous values `{ base: "spacing.3", l: ["spacing.10", "spacing.5"]}`',
      control: { type: 'object' },
    },
    backgroundColor: {
      name: 'backgroundColor',
      control: { type: 'object' },
      description:
        '<i>Only available in BaseBox</i>\n\n Value can be a token, absolute values or responsive object with token and absolute values',
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="This is the BaseBox component. It is only for internal Blade usage. Use Box instead."
          componentName="BaseBox"
          imports=""
        >
          <Sandbox>
            {`
          import { InternalDontUsePleaseWillBeRemovedSoonBaseBox as BaseBox } from '@razorpay/blade/components'

          function App(): JSX.Element {
            return (
              <BaseBox backgroundColor="red"><p>Hi there!</p></BaseBox>
            )
          }

          export default App;
          `}
          </Sandbox>
        </StoryPageWrapper>
      ),
    },
  },
} as Meta<BaseBoxProps>;

export const Default = (args: BaseBoxProps): JSX.Element => {
  return (
    <BaseBox {...args}>
      <Text>Change controls to see the parameters change for the container</Text>
    </BaseBox>
  );
};

export const Responsive = (args: BaseBoxProps): JSX.Element => {
  return (
    <BaseBox {...args}>
      <BaseBox flex="1" backgroundColor="yellow" minHeight="spacing.10" minWidth="spacing.10" />
      <BaseBox flex="1" backgroundColor="green" minHeight="50px" minWidth="50px" />
      <BaseBox flex="1" backgroundColor="purple" minHeight="50px" minWidth="50px" />
      <BaseBox flex="1" borderRadius="max" backgroundColor="red" minHeight="50px" minWidth="50px" />
    </BaseBox>
  );
};

Responsive.args = {
  display: 'flex',
  padding: { base: ['spacing.10', 'spacing.3'], l: 'spacing.3' },
  backgroundColor: 'surface.background.level2.lowContrast',
  flexDirection: { base: 'column', l: 'row' },
} as BaseBoxProps;

export default BoxStoryMeta;
