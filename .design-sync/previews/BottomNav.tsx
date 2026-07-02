import React from 'react';
import { BottomNav, BottomNavItem } from '@razorpay/blade/components';
import {
  HomeIcon,
  TransactionsIcon,
  PaymentLinkIcon,
  PaymentPagesIcon,
  MenuDotsIcon,
} from '@razorpay/blade/components';

export const Default = () => (
  <BottomNav position="relative">
    <BottomNavItem title="Home" href="/home" icon={HomeIcon} isActive />
    <BottomNavItem title="Transactions" href="/transactions" icon={TransactionsIcon} />
    <BottomNavItem title="Links" href="/links" icon={PaymentLinkIcon} />
    <BottomNavItem title="More" href="/more" icon={MenuDotsIcon} />
  </BottomNav>
);

export const FiveItems = () => (
  <BottomNav position="relative">
    <BottomNavItem title="Home" href="/home" icon={HomeIcon} />
    <BottomNavItem title="Transactions" href="/transactions" icon={TransactionsIcon} isActive />
    <BottomNavItem title="Links" href="/links" icon={PaymentLinkIcon} />
    <BottomNavItem title="Pages" href="/pages" icon={PaymentPagesIcon} />
    <BottomNavItem title="More" href="/more" icon={MenuDotsIcon} />
  </BottomNav>
);

export const ActiveStates = () => (
  <BottomNav position="relative">
    <BottomNavItem title="Home" href="/home" icon={HomeIcon} />
    <BottomNavItem title="Transactions" href="/transactions" icon={TransactionsIcon} isActive />
    <BottomNavItem title="Links" href="/links" icon={PaymentLinkIcon} />
    <BottomNavItem title="Pages" href="/pages" icon={PaymentPagesIcon} />
  </BottomNav>
);

export const ThreeItems = () => (
  <BottomNav position="relative">
    <BottomNavItem title="Home" href="/home" icon={HomeIcon} isActive />
    <BottomNavItem title="Transactions" href="/transactions" icon={TransactionsIcon} />
    <BottomNavItem title="Links" href="/links" icon={PaymentLinkIcon} />
  </BottomNav>
);
