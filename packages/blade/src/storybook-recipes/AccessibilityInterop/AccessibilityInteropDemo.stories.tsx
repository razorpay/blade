import AccessibilityInteropDemo from './AccessibilityInteropDemo';

import type { StoryFn, Meta } from '@storybook/react-vite';

export default {
  title: 'Recipes/AccessibilityInterop',
  component: AccessibilityInteropDemo,
} as Meta;

export const AccessibilityInteropDemoTemplate: StoryFn<typeof AccessibilityInteropDemo> = () => {
  return <AccessibilityInteropDemo />;
};
