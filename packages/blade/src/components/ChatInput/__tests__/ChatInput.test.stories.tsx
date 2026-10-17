/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import React from 'react';
import { ChatInput } from '../ChatInput';
import { BladeProvider } from '~components/BladeProvider';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { bladeTheme } from '~tokens/theme';

const onSubmit = fn();

const AmbientExample = ({ colorScheme }: { colorScheme: 'light' | 'dark' }): React.ReactElement => (
  <BladeProvider themeTokens={bladeTheme} colorScheme={colorScheme}>
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.6"
      maxWidth="600px"
      display="flex"
      flexDirection="column"
      gap="spacing.6"
    >
      <ChatInput borderEffect="ambient" testID="ambient-composer" onSubmit={onSubmit} />
      <Button variant="secondary">Move focus outside</Button>
    </Box>
  </BladeProvider>
);

export const AmbientLight: StoryFn<typeof ChatInput> = () => <AmbientExample colorScheme="light" />;

AmbientLight.play = async ({ canvasElement }) => {
  onSubmit.mockClear();
  const canvas = within(canvasElement);
  const composer = canvas.getByTestId('ambient-composer');
  const textarea = canvas.getByRole('textbox', { name: 'Chat input' });
  const decoration = composer.querySelector('span[aria-hidden="true"]') as HTMLElement;
  await expect(decoration).toBeVisible();
  await expect(window.getComputedStyle(decoration).pointerEvents).toBe('none');
  await expect(window.getComputedStyle(decoration, '::before').paddingTop).toBe('1px');
  const before = composer.getBoundingClientRect();

  await userEvent.click(textarea);
  await expect(textarea).toHaveFocus();
  await expect(decoration).toBeVisible();
  await expect(window.getComputedStyle(decoration, '::before').paddingTop).toBe('1.5px');
  const focused = composer.getBoundingClientRect();
  await expect(focused.width).toBe(before.width);
  await expect(focused.height).toBe(before.height);
  await expect(focused.x).toBe(before.x);
  await expect(focused.y).toBe(before.y);

  await userEvent.type(textarea, 'Hello');
  await expect(textarea).toHaveValue('Hello');
  await userEvent.keyboard('{Enter}');
  await expect(onSubmit).toHaveBeenCalledWith({ value: 'Hello', fileList: [] });

  await userEvent.click(canvas.getByRole('button', { name: 'Move focus outside' }));
  await expect(textarea).not.toHaveFocus();
  await expect(decoration).toBeVisible();
  const blurred = composer.getBoundingClientRect();
  await expect(blurred.width).toBe(before.width);
  await expect(blurred.height).toBe(before.height);
};

export const AmbientDark: StoryFn<typeof ChatInput> = () => <AmbientExample colorScheme="dark" />;
AmbientDark.play = AmbientLight.play;

export default {
  title: 'Components/Interaction Tests/ChatInput',
  parameters: {
    controls: { disable: true },
    essentials: { disable: true },
  },
};
