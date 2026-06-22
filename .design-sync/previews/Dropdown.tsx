import React from 'react';
import { Dropdown, DropdownOverlay } from '@razorpay/blade/components';
import { SelectInput } from '@razorpay/blade/components';
import { ActionList, ActionListItem } from '@razorpay/blade/components';

export const Default = () => (
  <Dropdown>
    <SelectInput label="Select Currency" />
    <DropdownOverlay>
      <ActionList>
        <ActionListItem title="Indian Rupee (INR)" value="inr" />
        <ActionListItem title="US Dollar (USD)" value="usd" />
        <ActionListItem title="Euro (EUR)" value="eur" />
        <ActionListItem title="British Pound (GBP)" value="gbp" />
      </ActionList>
    </DropdownOverlay>
  </Dropdown>
);

export const MultiSelect = () => (
  <Dropdown selectionType="multiple">
    <SelectInput label="Select Cities" />
    <DropdownOverlay>
      <ActionList>
        <ActionListItem title="Mumbai" value="mumbai" />
        <ActionListItem title="Bangalore" value="bangalore" />
        <ActionListItem title="Pune" value="pune" />
        <ActionListItem title="Chennai" value="chennai" />
        <ActionListItem title="Hyderabad" value="hyderabad" />
      </ActionList>
    </DropdownOverlay>
  </Dropdown>
);

export const ErrorState = () => (
  <Dropdown>
    <SelectInput
      label="Payment Method"
      validationState="error"
      errorText="Please select a payment method"
    />
    <DropdownOverlay>
      <ActionList>
        <ActionListItem title="Credit Card" value="credit_card" />
        <ActionListItem title="Debit Card" value="debit_card" />
        <ActionListItem title="Net Banking" value="net_banking" />
        <ActionListItem title="UPI" value="upi" />
      </ActionList>
    </DropdownOverlay>
  </Dropdown>
);

export const Disabled = () => (
  <Dropdown>
    <SelectInput label="Account Type" isDisabled />
    <DropdownOverlay>
      <ActionList>
        <ActionListItem title="Current Account" value="current" />
        <ActionListItem title="Savings Account" value="savings" />
      </ActionList>
    </DropdownOverlay>
  </Dropdown>
);

export const Sizes = () => (
  <>
    <Dropdown>
      <SelectInput label="Medium Size" size="medium" />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Option 1" value="option1" />
          <ActionListItem title="Option 2" value="option2" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
    <Dropdown>
      <SelectInput label="Large Size" size="large" />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Option 1" value="option1" />
          <ActionListItem title="Option 2" value="option2" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  </>
);
