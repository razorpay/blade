import React from 'react';
import { InfoGroup, InfoItem, InfoItemKey, InfoItemValue } from '../InfoGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { UserIcon, BankIcon, CheckIcon, InfoIcon } from '~components/Icons';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';
import { Avatar } from '~components/Avatar';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<InfoGroup /> (native)', () => {
  it('should render simple InfoGroup', () => {
    const { toJSON } = renderWithTheme(
      <InfoGroup>
        <InfoItem>
          <InfoItemKey>Account Holder</InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Payment Method</InfoItemKey>
          <InfoItemValue>Credit Card</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Transaction Amount</InfoItemKey>
          <InfoItemValue>₹1,234.56</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render InfoGroup with itemOrientation="vertical"', () => {
    const { toJSON } = renderWithTheme(
      <InfoGroup itemOrientation="vertical">
        <InfoItem>
          <InfoItemKey>Account Holder</InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Payment Method</InfoItemKey>
          <InfoItemValue>Credit Card</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Transaction Amount</InfoItemKey>
          <InfoItemValue>₹1,234.56</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Status</InfoItemKey>
          <InfoItemValue>Completed</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render InfoGroup with gridTemplateColumns prop without crashing (prop is ignored on native)', () => {
    // gridTemplateColumns is a web-only CSS prop; on native it resolves to `never`.
    // We cast it here to verify the component doesn't crash when it receives the prop.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gridTemplateColumns = '50% 50%' as any;
    const { toJSON } = renderWithTheme(
      <InfoGroup gridTemplateColumns={gridTemplateColumns}>
        <InfoItem>
          <InfoItemKey>Account Holder</InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Payment Method</InfoItemKey>
          <InfoItemValue>Credit Card</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render complex InfoGroup with horizontal itemOrientation, leading/trailing props, helpText', () => {
    const { toJSON } = renderWithTheme(
      <InfoGroup
        itemOrientation="horizontal"
        size="medium"
        valueAlign="right"
        isHighlighted={true}
        padding="spacing.3"
      >
        <InfoItem>
          <InfoItemKey leading={UserIcon} helpText="Customer information">
            Account Holder
          </InfoItemKey>
          <InfoItemValue leading={<Avatar name="Saurabh Daware" size="xsmall" />}>
            Saurabh Daware
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey leading={BankIcon} helpText="Payment method used">
            Payment Method
          </InfoItemKey>
          <InfoItemValue
            trailing={
              <Badge size="small" color="positive" emphasis="subtle">
                Active
              </Badge>
            }
          >
            Credit Card
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey leading={InfoIcon} helpText="Transaction amount">
            Transaction Amount
          </InfoItemKey>
          <InfoItemValue>
            <Amount value={123456} size="medium" />
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey leading={CheckIcon} helpText="Current status">
            Status
          </InfoItemKey>
          <InfoItemValue
            trailing={
              <Badge size="small" color="positive" emphasis="intense">
                Success
              </Badge>
            }
          >
            Completed
          </InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render InfoGroup with Avatars', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <InfoGroup itemOrientation="horizontal" size="medium">
        <InfoItem>
          <InfoItemKey
            leading={<Avatar size="medium" name="Saurabh Daware" />}
            helpText="Customer information"
            testID="info-item-key-with-avatar-1"
          >
            Account Holder
          </InfoItemKey>
          <InfoItemValue trailing={CheckIcon} testID="info-item-value-with-avatar-1">
            Saurabh Daware
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey testID="info-item-key-with-non-avatar" leading={<InfoIcon size="medium" />}>
            Support Agent
          </InfoItemKey>
          <InfoItemValue testID="info-item-value-with-non-avatar">John Doe</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );

    expect(toJSON()).toMatchSnapshot();
    expect(getByTestId('info-item-key-with-avatar-1')).toBeTruthy();
    expect(getByTestId('info-item-value-with-avatar-1')).toBeTruthy();
  });

  it('should accept testID on all components', () => {
    const { getByTestId } = renderWithTheme(
      <InfoGroup testID="info-group-test">
        <InfoItem testID="info-item-test">
          <InfoItemKey testID="info-item-key-test">Account Holder</InfoItemKey>
          <InfoItemValue testID="info-item-value-test">Saurabh Daware</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );

    expect(getByTestId('info-group-test')).toBeTruthy();
    expect(getByTestId('info-item-test')).toBeTruthy();
    expect(getByTestId('info-item-key-test')).toBeTruthy();
    expect(getByTestId('info-item-value-test')).toBeTruthy();
  });

  it('should render InfoGroup with different sizes', () => {
    const { toJSON } = renderWithTheme(
      <>
        <InfoGroup size="xsmall">
          <InfoItem>
            <InfoItemKey>Account Holder</InfoItemKey>
            <InfoItemValue>Saurabh Daware</InfoItemValue>
          </InfoItem>
        </InfoGroup>
        <InfoGroup size="small">
          <InfoItem>
            <InfoItemKey>Account Holder</InfoItemKey>
            <InfoItemValue>Saurabh Daware</InfoItemValue>
          </InfoItem>
        </InfoGroup>
        <InfoGroup size="medium">
          <InfoItem>
            <InfoItemKey>Account Holder</InfoItemKey>
            <InfoItemValue>Saurabh Daware</InfoItemValue>
          </InfoItem>
        </InfoGroup>
        <InfoGroup size="large">
          <InfoItem>
            <InfoItemKey>Account Holder</InfoItemKey>
            <InfoItemValue>Saurabh Daware</InfoItemValue>
          </InfoItem>
        </InfoGroup>
      </>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render InfoGroup with valueAlign left and right', () => {
    const { toJSON } = renderWithTheme(
      <>
        <InfoGroup valueAlign="left">
          <InfoItem>
            <InfoItemKey>Account Holder</InfoItemKey>
            <InfoItemValue>Saurabh Daware</InfoItemValue>
          </InfoItem>
        </InfoGroup>
        <InfoGroup valueAlign="right">
          <InfoItem>
            <InfoItemKey>Account Holder</InfoItemKey>
            <InfoItemValue>Saurabh Daware</InfoItemValue>
          </InfoItem>
        </InfoGroup>
      </>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render InfoGroup with isHighlighted=true (horizontal)', () => {
    const { toJSON } = renderWithTheme(
      <InfoGroup itemOrientation="horizontal" isHighlighted>
        <InfoItem>
          <InfoItemKey>Account Holder</InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Payment Method</InfoItemKey>
          <InfoItemValue>Credit Card</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render InfoGroup with isHighlighted=true (vertical)', () => {
    const { toJSON } = renderWithTheme(
      <InfoGroup itemOrientation="vertical" isHighlighted>
        <InfoItem>
          <InfoItemKey>Account Holder</InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Payment Method</InfoItemKey>
          <InfoItemValue>Credit Card</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render InfoGroup with per-item isHighlighted override', () => {
    const { toJSON } = renderWithTheme(
      <InfoGroup itemOrientation="horizontal" isHighlighted={false}>
        <InfoItem isHighlighted={true}>
          <InfoItemKey>Account Holder</InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem isHighlighted={false}>
          <InfoItemKey>Payment Method</InfoItemKey>
          <InfoItemValue>Credit Card</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render vertical InfoGroup with gridTemplateColumns="1fr" as a single stacked column', () => {
    const { toJSON } = renderWithTheme(
      // gridTemplateColumns is a web CSS type; cast for the native emulation path.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <InfoGroup itemOrientation="vertical" isHighlighted gridTemplateColumns={'1fr' as any}>
        <InfoItem>
          <InfoItemKey>Account Holder</InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Payment Method</InfoItemKey>
          <InfoItemValue>Credit Card</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render vertical InfoGroup with gridTemplateColumns="1fr 1fr" as two equal columns', () => {
    const { toJSON } = renderWithTheme(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <InfoGroup itemOrientation="vertical" gridTemplateColumns={'1fr 1fr' as any}>
        <InfoItem>
          <InfoItemKey>Account Holder</InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Payment Method</InfoItemKey>
          <InfoItemValue>Credit Card</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Status</InfoItemKey>
          <InfoItemValue>Completed</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render vertical InfoGroup with gridTemplateColumns="repeat(2, 1fr)" as two equal columns', () => {
    const { toJSON } = renderWithTheme(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <InfoGroup itemOrientation="vertical" gridTemplateColumns={'repeat(2, 1fr)' as any}>
        <InfoItem>
          <InfoItemKey>Account Holder</InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Payment Method</InfoItemKey>
          <InfoItemValue>Credit Card</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render vertical InfoGroup with more than 4 items (wraps to next row)', () => {
    const { toJSON } = renderWithTheme(
      <InfoGroup itemOrientation="vertical">
        <InfoItem>
          <InfoItemKey>Item 1</InfoItemKey>
          <InfoItemValue>Value 1</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Item 2</InfoItemKey>
          <InfoItemValue>Value 2</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Item 3</InfoItemKey>
          <InfoItemValue>Value 3</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Item 4</InfoItemKey>
          <InfoItemValue>Value 4</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Item 5</InfoItemKey>
          <InfoItemValue>Value 5</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
