import React from 'react';
import { Breadcrumb, BreadcrumbItem } from '@razorpay/blade/components';
import { HomeIcon } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

export const Default = () => (
  <Breadcrumb>
    <BreadcrumbItem icon={HomeIcon} href="/" accessibilityLabel="Home" />
    <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
    <BreadcrumbItem isCurrentPage href="/settlements">
      Settlements
    </BreadcrumbItem>
  </Breadcrumb>
);

export const WithText = () => (
  <Breadcrumb>
    <BreadcrumbItem href="/">Home</BreadcrumbItem>
    <BreadcrumbItem href="/products">Products</BreadcrumbItem>
    <BreadcrumbItem href="/payments">Payments</BreadcrumbItem>
    <BreadcrumbItem isCurrentPage href="/international-payments">
      International Payments
    </BreadcrumbItem>
  </Breadcrumb>
);

export const Small = () => (
  <Breadcrumb size="small">
    <BreadcrumbItem icon={HomeIcon} href="/" accessibilityLabel="Home" />
    <BreadcrumbItem href="/accounts">Accounts</BreadcrumbItem>
    <BreadcrumbItem isCurrentPage href="/transactions">
      Transactions
    </BreadcrumbItem>
  </Breadcrumb>
);

export const Large = () => (
  <Breadcrumb size="large">
    <BreadcrumbItem icon={HomeIcon} href="/" accessibilityLabel="Home" />
    <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
    <BreadcrumbItem isCurrentPage href="/payment-methods">
      Payment Methods
    </BreadcrumbItem>
  </Breadcrumb>
);

export const Neutral = () => (
  <Breadcrumb color="neutral">
    <BreadcrumbItem icon={HomeIcon} href="/" accessibilityLabel="Home" />
    <BreadcrumbItem href="/reports">Reports</BreadcrumbItem>
    <BreadcrumbItem isCurrentPage href="/monthly">
      Monthly Report
    </BreadcrumbItem>
  </Breadcrumb>
);

export const LongPath = () => (
  <Breadcrumb>
    <BreadcrumbItem icon={HomeIcon} href="/" accessibilityLabel="Home" />
    <BreadcrumbItem href="/products">Products</BreadcrumbItem>
    <BreadcrumbItem href="/payments">Payments</BreadcrumbItem>
    <BreadcrumbItem href="/international">International</BreadcrumbItem>
    <BreadcrumbItem href="/cross-border">Cross-Border</BreadcrumbItem>
    <BreadcrumbItem isCurrentPage href="/configuration">
      Configuration
    </BreadcrumbItem>
  </Breadcrumb>
);
