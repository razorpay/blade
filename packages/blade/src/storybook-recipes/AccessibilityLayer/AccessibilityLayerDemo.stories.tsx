import type { ComponentStory, Meta } from '@storybook/react';
import NativeAria from './NativeAria';

export default {
  title: 'Recipes/AccessibilityLayerDemo',
  component: NativeAria,
} as Meta;

export const MapAccessibilityProps: ComponentStory<typeof NativeAria> = () => {
  return <NativeAria />;
};
