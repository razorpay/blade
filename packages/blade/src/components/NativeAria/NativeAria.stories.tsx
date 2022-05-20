import type { ComponentStory, Meta } from '@storybook/react';
import NativeAria from './';

export default {
  title: 'Components/NativeAria',
  component: NativeAria,
} as Meta;

const NativeAriaTemplate: ComponentStory<typeof NativeAria> = () => {
  return <NativeAria />;
};

export const NativeAriaExample = NativeAriaTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
NativeAriaExample.storyName = 'NativeAriaExample';
