import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import React, { useState } from 'react';
import ButtonComponent from '../Button';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

// Buttons with an AI hover stay plain buttons to use: hovering them (RazorSense, or Ray widening the button) doesn't get in the
// way of clicking or the keyboard, and their label stays their accessible name. This holds with or without a GPU: where the
// hover can't animate (CI's browsers often have no WebGL2) the button keeps its own hover.
export const TestAiHoverButtonsStayButtons: StoryFn<typeof ButtonComponent> = () => {
  const [askRay, setAskRay] = useState(0);
  const [investigate, setInvestigate] = useState(0);
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5" padding="spacing.10">
      <Box display="flex" gap="spacing.5" alignItems="center">
        <ButtonComponent
          variant="primary"
          color="neutral"
          aiHover="razorsense"
          onClick={() => setAskRay((n) => n + 1)}
        >
          Ask Ray
        </ButtonComponent>
        <ButtonComponent
          variant="secondary"
          aiHover="ray-investigate"
          onClick={() => setInvestigate((n) => n + 1)}
        >
          Investigate
        </ButtonComponent>
      </Box>
      <Text>{`Ask Ray: ${askRay} · Investigate: ${investigate}`}</Text>
    </Box>
  );
};

TestAiHoverButtonsStayButtons.play = async ({ canvasElement }) => {
  const { getByRole, getByText } = within(canvasElement);
  const askRay = getByRole('button', { name: 'Ask Ray' });
  const investigate = getByRole('button', { name: 'Investigate' });
  // hovered (its effect starting), then clicked
  await userEvent.hover(askRay);
  await userEvent.click(askRay);
  await userEvent.hover(investigate);
  await new Promise((resolve) => setTimeout(resolve, 600));
  await userEvent.click(investigate);
  await expect(getByText('Ask Ray: 1 · Investigate: 1')).toBeInTheDocument();
  // the keyboard: focused and pressed, as any button
  investigate.focus();
  await expect(investigate).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  askRay.focus();
  await userEvent.keyboard(' ');
  await expect(getByText('Ask Ray: 2 · Investigate: 2')).toBeInTheDocument();
  await userEvent.unhover(investigate);
};

export default {
  title: 'Components/Interaction Tests/Button AI Hovers',
  component: ButtonComponent,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
  },
};
