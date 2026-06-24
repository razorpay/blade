import React from 'react';
import { SearchInput } from '@razorpay/blade/components';

export const Default = () => (
  <SearchInput
    label="Search Transactions"
    placeholder="Search by transaction ID, amount, or customer"
    name="search"
  />
);

export const WithHelpText = () => (
  <SearchInput
    label="Search Payment Methods"
    placeholder="Search payment methods"
    helpText="Try searching for 'UPI', 'Card', or 'Net Banking'"
    name="searchMethods"
  />
);

export const WithoutLabel = () => (
  <SearchInput
    placeholder="Search settlements, refunds, or disputes"
    accessibilityLabel="Search settlements, refunds, or disputes"
    name="searchAll"
  />
);

export const Disabled = () => (
  <SearchInput
    label="Search Customers"
    placeholder="Search by customer name or email"
    isDisabled
    name="searchCustomers"
  />
);

export const Sizes = () => (
  <>
    <SearchInput
      label="Medium Size"
      placeholder="Search invoices"
      size="medium"
      name="searchMedium"
    />
    <SearchInput
      label="Large Size"
      placeholder="Search invoices"
      size="large"
      name="searchLarge"
    />
  </>
);

export const Loading = () => (
  <SearchInput
    label="Search Products"
    placeholder="Search payment products"
    isLoading
    name="searchProducts"
  />
);
