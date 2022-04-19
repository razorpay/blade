import type { ComponentStory, Meta } from '@storybook/react';
import BaseTextComponent from './BaseText';

export default {
  title: 'Components/Typography',
  component: BaseTextComponent,
  args: {
    color: 'surface.text.normal.lowContrast',
    fontFamily: 'text',
    fontSize: 700,
    fontWeight: 'regular',
    fontStyle: 'normal',
    textAlign: 'left',
    textDecorationLine: 'none',
    lineHeight: 'm',
    name: 'Storybook',
    children: 'Base Text',
  },
} as Meta;

const BaseTextTemplate: ComponentStory<typeof BaseTextComponent> = (args) => {
  return <BaseTextComponent {...args}>{args.children}</BaseTextComponent>;
};

export const BaseText = BaseTextTemplate.bind({});
