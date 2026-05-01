import type { Meta, StoryFn } from '@storybook/react-native';
import React from 'react';
import type { TextProps } from './';
import { Text as TextComponent } from './';

const TextStoryMeta: Meta<TextProps<{ variant: 'body' | 'caption' }>> = {
  title: 'Components/Typography/Text',
  component: TextComponent,
  args: {
    variant: 'body',
    weight: 'regular',
    size: 'medium',
    children: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
  },
};

const TextTemplate: StoryFn<typeof TextComponent> = (args) => {
  return <TextComponent {...args}>{args.children}</TextComponent>;
};

export default TextStoryMeta;
export const Text = TextTemplate.bind({});
export const WithColor = TextTemplate.bind({});
WithColor.args = {
  color: 'surface.text.primary.normal',
};

export const Semibold = TextTemplate.bind({});
Semibold.args = {
  weight: 'semibold',
};

export const Caption = TextTemplate.bind({});
Caption.args = {
  variant: 'caption',
};
