// @TODO: test story. Remove later
import type { Meta } from '@storybook/react';
import type { BaseBoxProps } from './types';
import { BaseBox } from '.';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { Text } from '~components/Typography';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';

const baseBoxStoryArgs = {
  padding: [
    'Can be',
    '- an absolute value like `"10px"`',
    '- token `"spacing.5"`',
    '- an array shorthand `["spacing.2", "10px", "spacing.5", "spacing.9"]',
    '- responsive object with combinatation of all previous values `{ base: "spacing.3", l: ["spacing.10", "spacing.5"]}`',
  ].join('\n\n'),
  margin: [
    'Can be',
    '- an absolute value like `"10px"`',
    '- token `"spacing.5"`',
    '- an array shorthand `["spacing.2", "10px", "spacing.5", "spacing.9"]',
    '- responsive object with combinatation of all previous values `{ base: "spacing.3", l: ["spacing.10", "spacing.5"]}`',
  ].join('\n\n'),

  backgroundColor:
    '<i>Only available in BaseBox</i>\n\n Value can be a color token, absolute values or responsive object with token and absolute values',
  display:
    'CSS `display` property. Can be  \n\n - string like `block`, `flex`, `none`, etc\n\n- Responsive object `{ base: "block", m: "none" }`',
  overflow: '',
  flex: '',
  flexWrap: '',
  flexDirection: '',
  flexGrow: '',
  flexShrink: '',
  flexBasis: '',
  alignItems: '',
  alignContent: '',
  alignSelf: '',
  justifyItems: '',
  justifyContent: '',
  justifySelf: '',
  order: '',
  position: '',
  zIndex: '',
  grid: '',
  gridColumn: '',
  gridRow: '',
  gridRowStart: '',
  gridRowEnd: '',
  gridArea: '',
  gridAutoFlow: '',
  gridAutoRows: '',
  gridAutoColumns: '',
  gridTemplate: '',
  gridTemplateAreas: '',
  gridTemplateColumns: '',
  gridTemplateRows: '',
  transform: '',
};

const getBaseBoxArgTypes = (): Record<
  string,
  { name: string; description: string; control: { type: 'object' } }
> => {
  return Object.fromEntries(
    Object.entries(baseBoxStoryArgs).map(([argName, argDescription]) => {
      let description = argDescription;
      const cssPropertyName = argName.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

      if (!description) {
        description = `CSS property \`${cssPropertyName}\`. \n\nCan be it's CSS Value or Responsive Object with CSS Value.\n\nCheckout: https://developer.mozilla.org/en-US/docs/Web/CSS/${cssPropertyName}`;
      }

      return [
        argName,
        {
          name: argName,
          description,
          table: { category: argDescription === 'SPACING' ? 'SpacingProps' : undefined },
          control: { type: 'object' },
        },
      ];
    }),
  );
};

const BoxStoryMeta = {
  title: 'Components/Box/BaseBox (Internal)',
  component: BaseBox,
  argTypes: getBaseBoxArgTypes(),
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
              <BaseBox 
                padding={{ base: ['spacing.1', '9px'], m: 'spacing.3' }}
                backgroundColor="feedback.background.positive.lowContrast"
                display="flex"
                flexDirection={{ base: 'column', m: 'row' }}
              >
                <BaseBox flex="1" backgroundColor="yellow" minHeight="spacing.10" minWidth="spacing.10" />
                <BaseBox flex="1" backgroundColor="red" minHeight="spacing.10" minWidth="spacing.10" />
              </BaseBox>
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
