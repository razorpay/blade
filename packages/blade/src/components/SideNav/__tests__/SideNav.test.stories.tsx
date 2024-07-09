/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import type { SideNav } from '../index';
import { SKIP_NAV_ID } from '../tokens';
import { SideNavExample } from './SideNavExample';
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const MenuNavigation: StoryFn<typeof SideNav> = (props): React.ReactElement => {
  return <SideNavExample {...props} />;
};

MenuNavigation.play = async ({ canvasElement }) => {
  const { getByRole, queryByRole } = within(canvasElement);
  await expect(getByRole('navigation')).toBeVisible();

  // L1 Selections
  await expect(getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  await userEvent.click(getByRole('link', { name: 'Gateway' }));
  await expect(getByRole('link', { name: 'Gateway' })).toHaveAttribute('aria-current', 'page');
  await expect(getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current', 'page');
  await expect(queryByRole('link', { name: 'L2 Item 2' })).not.toBeInTheDocument();

  // L2 Selections
  await userEvent.click(getByRole('link', { name: 'L2 Trigger' }));
  await expect(getByRole('link', { name: 'L2 Item' })).toHaveAttribute('aria-current', 'page');
  await userEvent.click(getByRole('link', { name: 'L2 Item 2' }));
  await expect(getByRole('link', { name: 'L2 Item 2' })).toHaveAttribute('aria-current', 'page');

  // L1 Hover
  await sleep(500);
  await expect(queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
  const l1Element = document.querySelector('#blade-sidenav-l1')!;
  await userEvent.hover(l1Element);
  await sleep(500);
  await expect(getByRole('link', { name: 'Home' })).toBeVisible();
  await userEvent.unhover(l1Element);

  // L3 Expand and Select
  await expect(getByRole('button', { name: 'L3 Trigger' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await userEvent.click(getByRole('button', { name: 'L3 Trigger' }));
  await expect(getByRole('button', { name: 'L3 Trigger' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );

  await userEvent.click(getByRole('link', { name: 'L3 Item 2' }));
  await expect(getByRole('link', { name: 'L3 Item 2' })).toHaveAttribute('aria-current', 'page');

  // Back to L1 Selection
  await sleep(500);
  await userEvent.hover(l1Element);
  await sleep(500);
  await expect(getByRole('link', { name: 'Home' })).toBeVisible();
  await userEvent.click(getByRole('link', { name: 'Links' }));
  await expect(getByRole('link', { name: 'Links' })).toHaveAttribute('aria-current', 'page');
};

export const Accessibility: StoryFn<typeof SideNav> = (props): React.ReactElement => {
  return <SideNavExample {...props} />;
};

Accessibility.play = async ({ canvasElement }) => {
  const { getByRole, queryByRole } = within(canvasElement);
  await expect(getByRole('navigation')).toBeVisible();

  await userEvent.keyboard('{TAB}');
  await expect(getByRole('link', { name: 'Skip to content' })).toHaveFocus();
  await expect(getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
    'href',
    `#${SKIP_NAV_ID}`,
  );
  await userEvent.keyboard('{TAB}');
  await expect(getByRole('link', { name: 'Home' })).toHaveFocus();
  await userEvent.keyboard('{TAB}');
  await expect(getByRole('link', { name: 'L2 Trigger' })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard('{TAB}');
  await expect(getByRole('link', { name: 'L2 Item' })).toHaveFocus();
  await sleep(500);
  await expect(queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();

  await userEvent.keyboard('{Shift>}{Tab}');
  await expect(getByRole('link', { name: 'L2 Trigger' })).toHaveFocus();
  await expect(getByRole('link', { name: 'Home' })).toBeVisible();
  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard('{TAB}');
  await userEvent.keyboard('{TAB}');
  await userEvent.keyboard('{TAB}');
  await expect(getByRole('button', { name: 'L3 Trigger' })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard('{TAB}');
  await userEvent.keyboard('{Enter}');
  await expect(getByRole('link', { name: 'L3 Item' })).toHaveAttribute('aria-current', 'page');
  await userEvent.keyboard('{Shift>}{Tab}');
  await userEvent.keyboard('{Shift>}{Tab}');
  await userEvent.keyboard('{Shift>}{Tab}');
  await userEvent.keyboard('{Shift>}{Tab}');
  await expect(getByRole('link', { name: 'L2 Trigger' })).toHaveFocus();
  await userEvent.keyboard('{TAB}');
  await userEvent.keyboard('{TAB}');
  await userEvent.keyboard('{TAB}');
  await expect(getByRole('button', { name: '+2 More' })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard('{TAB}');
  await expect(getByRole('link', { name: 'Pages' })).toHaveFocus();
  await userEvent.keyboard('{Shift>}{Tab}');
  await expect(getByRole('button', { name: 'Show Less' })).toHaveFocus();
  await userEvent.keyboard('{TAB}');
  await userEvent.keyboard('{TAB}');
  await userEvent.keyboard('{TAB}');
  await expect(getByRole('switch')).toHaveFocus();
};

export default {
  title: 'Components/Interaction Tests/SideNav',
  component: SideNavExample,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};
