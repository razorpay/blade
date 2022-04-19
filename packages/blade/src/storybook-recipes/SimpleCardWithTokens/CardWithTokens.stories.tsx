import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Card from './Card';

const CardMeta: ComponentMeta<typeof Card> = {
  title: 'Recipes/CardWithTokens',
  component: Card,
};
export default CardMeta;

export const CardStory: ComponentStory<typeof Card> = () => <Card />;
