/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import React from 'react';
import { Slider } from '../Slider';

export const KeyboardInteraction: StoryFn<typeof Slider> = () => (
  <Slider label="Volume" defaultValue={40} step={5} />
);

KeyboardInteraction.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const slider = canvas.getByRole('slider', { name: 'Volume' });

  await userEvent.tab();
  await expect(slider).toHaveFocus();
  await userEvent.keyboard('[ArrowRight]');
  await expect(slider).toHaveAttribute('aria-valuenow', '45');
  await userEvent.keyboard('[End]');
  await expect(slider).toHaveAttribute('aria-valuenow', '100');
  await userEvent.keyboard('[Home]');
  await expect(slider).toHaveAttribute('aria-valuenow', '0');
};

export const RangeKeyboardInteraction: StoryFn<typeof Slider> = () => (
  <Slider label="Amount" variant="range" defaultValue={[20, 80]} step={10} />
);

RangeKeyboardInteraction.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const [minimum, maximum] = canvas.getAllByRole('slider');

  await userEvent.tab();
  await expect(minimum).toHaveFocus();
  await userEvent.keyboard('[ArrowRight]');
  await expect(minimum).toHaveAttribute('aria-valuenow', '30');
  await userEvent.tab();
  await expect(maximum).toHaveFocus();
  await userEvent.keyboard('[ArrowLeft]');
  await expect(maximum).toHaveAttribute('aria-valuenow', '70');
};

export default {
  title: 'Components/Slider/Interaction Tests',
  component: Slider,
  tags: ['slider-test'],
};
