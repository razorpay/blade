import type { StoryFn, Meta } from '@storybook/react';
import AccessibilityInteropDemo from './AccessibilityInteropDemo';

export default {
  title: 'Recipes/AccessibilityInterop',
  component: AccessibilityInteropDemo,
} as Meta;

export const AccessibilityInteropDemoTemplate: StoryFn<typeof AccessibilityInteropDemo> = () => {
  return <AccessibilityInteropDemo />;
};
