/* eslint-disable react/display-name */
import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { BaseTextProps } from './BaseText';
import BaseTextComponent from './BaseText';

export default {
  title: 'Components/Typography/BaseText',
  component: BaseTextComponent,
  args: {
    color: 'surface.text.normal.lowContrast',
    fontFamily: 'text',
    fontSize: 700,
    fontWeight: 'regular',
    fontStyle: 'normal',
    textAlign: 'left',
    textDecorationLine: 'none',
    lineHeight: '5xl',
    name: 'Storybook',
    children: 'Base Text',
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>
            The BaseText component is a wrapper component based on Blade&apos;s token system and
            should be used only in rarest exceptions where your Typography needs are not satisfied
            by Title, Heading or Text typography components(eg: highlighting a word in the Title
            with gradients in a landing page).
          </Subtitle>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<BaseTextProps>;

const BaseTextTemplate: ComponentStory<typeof BaseTextComponent> = (args) => {
  return <BaseTextComponent {...args}>{args.children}</BaseTextComponent>;
};

export const BaseText = BaseTextTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
BaseText.storyName = 'BaseText';
