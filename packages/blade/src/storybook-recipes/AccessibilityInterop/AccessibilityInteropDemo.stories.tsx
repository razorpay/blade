import type { ComponentStory, Meta } from '@storybook/react';
import AccessibilityInteropDemo from './AccessibilityInteropDemo';

export default {
  title: 'Recipes/AccessibilityInterop',
  component: AccessibilityInteropDemo,
} as Meta;

export const MapAccessibilityProps: ComponentStory<typeof AccessibilityInteropDemo> = () => {
  return <AccessibilityInteropDemo />;
};
