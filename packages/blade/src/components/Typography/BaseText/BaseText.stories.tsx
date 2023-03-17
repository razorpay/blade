import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { Highlight } from '@storybook/design-system';
import { BaseText as BaseTextComponent } from './BaseText';
import type { BaseTextProps } from './types';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

export default {
  title: 'Components/Typography/BaseText (Internal)',
  component: BaseTextComponent,
  args: {
    color: 'surface.text.normal.lowContrast',
    fontFamily: 'text',
    fontSize: 200,
    fontWeight: 'regular',
    fontStyle: 'normal',
    textAlign: 'left',
    textDecorationLine: 'none',
    lineHeight: 'l',
    name: 'Storybook',
    children:
      'Current Accounts supercharged by RazorpayX come with integrated tools and integrations that make financial management and accounting simple',
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="The BaseText component is a wrapper component based on Blade's token system and should be used only in rarest exceptions where your Typography needs are not satisfied by Title, Heading or Text typography components(eg: highlighting a word in the Title with gradients in a landing page)."
          componentName="BaseText"
        >
          <Title>Usage</Title>
          <Highlight language="tsx">{`import { BaseText } from '@razorpay/blade/components' \nimport type { BaseTextProps } from '@razorpay/blade/components'`}</Highlight>
        </StoryPageWrapper>
      ),
    },
  },
  argTypes: getStyledPropsArgTypes(),
} as Meta<BaseTextProps>;

const BaseTextTemplate: ComponentStory<typeof BaseTextComponent> = (args) => {
  return <BaseTextComponent {...args}>{args.children}</BaseTextComponent>;
};

export const BaseText = BaseTextTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
BaseText.storyName = 'BaseText';
