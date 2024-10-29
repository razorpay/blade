/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import React from 'react';
import type { TabNavProps } from '../TabNav';
import { TabNav, TabNavItem, TabNavItems } from '../TabNav';
import {
  AcceptPaymentsIcon,
  AwardIcon,
  ChevronDownIcon,
  HomeIcon,
  MagicCheckoutIcon,
  RazorpayxPayrollIcon,
} from '~components/Icons';
import { Menu, MenuItem, MenuOverlay } from '~components/Menu';
import { Text } from '~components/Typography';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const TabNavExample = ({ items }: { items?: TabNavProps['items'] }): React.ReactElement => {
  return (
    <TabNav
      items={
        items ?? [
          { title: 'Home', href: '/home', icon: HomeIcon },
          {
            href: '/payroll',
            title: 'Payroll',
            icon: RazorpayxPayrollIcon,
            description: 'Automate payroll with ease.',
          },
          {
            href: '/payments',
            title: 'Payments',
            icon: AcceptPaymentsIcon,
            description: 'Manage payments effortlessly.',
          },
          {
            href: '/magic-checkout',
            title: 'Magic Checkout',
            icon: MagicCheckoutIcon,
            description: 'Fast, one-click checkout.',
          },
          {
            href: '/rize',
            title: 'Rize',
            icon: AwardIcon,
            isAlwaysOverflowing: true,
            description: 'Boost your business growth.',
          },
        ]
      }
    >
      {({ items, overflowingItems }) => {
        return (
          <>
            <TabNavItems>
              {items.map((item) => {
                return (
                  <TabNavItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                    isActive={item.isActive}
                    trailing={item.trailing}
                  />
                );
              })}
            </TabNavItems>
            {overflowingItems.length ? (
              <Menu openInteraction="hover">
                <TabNavItem as="button" title="More" trailing={<ChevronDownIcon />} />
                <MenuOverlay>
                  {overflowingItems.map((item) => {
                    return (
                      <MenuItem
                        key={item.href}
                        onClick={() => {
                          console.log('clicked', item.title);
                        }}
                      >
                        <Text>{item.title}</Text>
                      </MenuItem>
                    );
                  })}
                </MenuOverlay>
              </Menu>
            ) : null}
          </>
        );
      }}
    </TabNav>
  );
};

export const TestBasicTabNav: StoryFn<typeof TabNav> = (): React.ReactElement => {
  return <TabNavExample />;
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
  return <TabNavExample />;
};

TestOverflow.play = async ({ canvasElement }) => {
  const { getByRole, queryByRole } = within(document.body);
  canvasElement.style.width = '100%';

  await sleep(500);
  const homeTab = getByRole('link', { name: 'Home' });
  const payrollTab = getByRole('link', { name: 'Payroll' });
  const paymentsTab = getByRole('link', { name: 'Payments' });
  await expect(homeTab).toBeVisible();
  await expect(payrollTab).toBeVisible();
  await expect(paymentsTab).toBeVisible();

  await sleep(500);

  // reduce the width of the canvas to make the tabs overflow
  canvasElement.style.width = '600px';
  await sleep(500);

  const moreTab = getByRole('button', { name: 'More' });
  await userEvent.hover(moreTab);
  await sleep(500);
  await expect(queryByRole('menu', { name: 'More' })).toBeVisible();
  await expect(queryByRole('menuitem', { name: 'Rize' })).toBeVisible();
  await expect(queryByRole('link', { name: 'Magic Checkout' })).toBeNull();
  await expect(queryByRole('menuitem', { name: 'Magic Checkout' })).toBeVisible();

  canvasElement.style.width = '300px';
  await sleep(500);
  await expect(queryByRole('link', { name: 'Payroll' })).toBeNull();
  await expect(queryByRole('link', { name: 'Payments' })).toBeNull();
  await expect(queryByRole('menuitem', { name: 'Payroll' })).toBeVisible();
  await expect(queryByRole('menuitem', { name: 'Payments' })).toBeVisible();

  canvasElement.style.width = '100%';
  await sleep(500);
  await expect(queryByRole('menuitem', { name: 'Rize' })).toBeVisible();
  await expect(queryByRole('menuitem', { name: 'Payroll' })).toBeNull();
  await expect(queryByRole('menuitem', { name: 'Payments' })).toBeNull();
  await expect(queryByRole('menuitem', { name: 'Magic Checkout' })).toBeNull();
};

export const ShouldNotShowMore: StoryFn<typeof TabNav> = (): React.ReactElement => {
  return (
    <TabNavExample
      items={[
        { title: 'Home', href: '/home', icon: HomeIcon },
        { title: 'Payroll', href: '/payroll', icon: RazorpayxPayrollIcon },
        { title: 'Payments', href: '/payments', icon: AcceptPaymentsIcon },
      ]}
    />
  );
};

ShouldNotShowMore.play = async ({ canvasElement }) => {
  const { getByRole, queryByRole } = within(document.body);

  await sleep(500);
  const homeTab = getByRole('link', { name: 'Home' });
  const payrollTab = getByRole('link', { name: 'Payroll' });
  const paymentsTab = getByRole('link', { name: 'Payments' });
  await expect(homeTab).toBeVisible();
  await expect(payrollTab).toBeVisible();
  await expect(paymentsTab).toBeVisible();
  await expect(queryByRole('button', { name: 'More' })).toBeNull();

  await sleep(500);

  // reduce the width of the canvas to make the tabs overflow
  canvasElement.style.width = '200px';
  await sleep(500);

  const moreTab = getByRole('button', { name: 'More' });
  await expect(moreTab).toBeVisible();

  // hover over the more tab
  await userEvent.hover(moreTab);
  await sleep(500);

  await expect(queryByRole('menu', { name: 'More' })).toBeVisible();
  await expect(queryByRole('menuitem', { name: 'Payments' })).toBeVisible();
  await expect(queryByRole('menuitem', { name: 'Payroll' })).toBeVisible();
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
