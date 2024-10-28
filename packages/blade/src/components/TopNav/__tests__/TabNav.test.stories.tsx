/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import React from 'react';
import { TabNav } from '../TabNav';
import { Box } from '~components/Box';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const TestBasicTabNav: StoryFn<typeof TabNav> = (): React.ReactElement => {
  return <p>hi</p>;
};

TestBasicTabNav.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  const homeTab = getByRole('link', { name: 'Home' });
  const payrollTab = getByRole('link', { name: 'Payroll' });
  const paymentsTab = getByRole('link', { name: 'Payments' });
  await expect(homeTab).toHaveAttribute('href', '/home');
  await expect(payrollTab).toHaveAttribute('href', '/payroll');
  await expect(paymentsTab).toHaveAttribute('href', '/payments');
};

export const TestOverflow: StoryFn<typeof TabNav> = (): React.ReactElement => {
  return (
    <Box width="300px">
      <p>hi</p>
    </Box>
  );
};

TestOverflow.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  await sleep(500);
  const item1 = getByRole('link', { name: 'Item 1' });
  const scrollLeftButton = getByRole('button', { name: /Scroll Left/ });
  const scrollRightButton = getByRole('button', { name: /Scroll Right/ });
  await expect(scrollLeftButton).not.toBeVisible();

  await expect(item1).toBeVisible();
  await expect(scrollRightButton).toBeVisible();
  // scroll
  await userEvent.click(scrollRightButton);
  await sleep(500);

  await expect(scrollLeftButton).toBeVisible();
  await expect(scrollRightButton).toBeVisible();

  // scroll to end
  await userEvent.click(scrollRightButton);
  await sleep(500);
  await expect(scrollLeftButton).toBeVisible();
  await expect(scrollRightButton).not.toBeVisible();
};

export default {
  title: 'Components/Interaction Tests/TabNav',
  component: TabNav,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};
