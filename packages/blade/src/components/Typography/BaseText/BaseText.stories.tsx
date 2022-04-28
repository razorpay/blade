import type { ComponentStory, Meta } from '@storybook/react';
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
} as Meta<BaseTextProps>;

const BaseTextTemplate: ComponentStory<typeof BaseTextComponent> = (args) => {
  return <BaseTextComponent {...args}>{args.children}</BaseTextComponent>;
};

export const BaseText = BaseTextTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
BaseText.storyName = 'BaseText';
