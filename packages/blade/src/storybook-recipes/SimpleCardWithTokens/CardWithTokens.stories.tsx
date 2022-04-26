import React from 'react';
import type { ComponentStory } from '@storybook/react';
import CardComponent from './Card';

export default {
  title: 'Recipes/CardWithTokens',
  component: CardComponent,
};

export const Card: ComponentStory<typeof CardComponent> = () => <CardComponent />;
