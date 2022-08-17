import React from 'react';
import type { ComponentStory } from '@storybook/react';
import { OverrideTheme } from './OverrideTheme';

export default {
  title: 'Recipes/OverrideTheme',
  component: OverrideTheme,
};

export const OverrideThemeExample: ComponentStory<typeof OverrideTheme> = () => <OverrideTheme />;
