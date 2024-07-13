/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import React from 'react';
import { TabNav, TabNavItem } from '../TabNav';
import { Box } from '~components/Box';
import { HomeIcon } from '~components/Icons';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const TestBasicTabNav: StoryFn<typeof TabNav> = (): React.ReactElement => {
  return (
    <TabNav>
      <TabNavItem icon={HomeIcon} accessibilityLabel="Home" href="/home" />
      <TabNavItem href="/payroll">Payroll</TabNavItem>
      <TabNavItem href="/payments">Payments</TabNavItem>
    </TabNav>
  );
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
      <TabNav>
        <TabNavItem href="/item-1">Item 1</TabNavItem>
        <TabNavItem href="/item-2">Item 2</TabNavItem>
        <TabNavItem href="/item-3">Item 3</TabNavItem>
        <TabNavItem href="/item-4">Item 4</TabNavItem>
        <TabNavItem href="/item-5">Item 5</TabNavItem>
        <TabNavItem href="/item-6">Item 6</TabNavItem>
        <TabNavItem href="/item-7">Item 7</TabNavItem>
        <TabNavItem href="/item-8">Item 8</TabNavItem>
        <TabNavItem href="/item-9">Item 9</TabNavItem>
      </TabNav>
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
