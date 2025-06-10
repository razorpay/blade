import React from 'react';
import { InfoGroup, InfoItem, InfoItemKey, InfoItemValue } from '../InfoGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { UserIcon, BankIcon, CheckIcon, InfoIcon, CopyIcon } from '~components/Icons';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';
import { Avatar } from '~components/Avatar';
import { Link } from '~components/Link';
import { Code } from '~components/Typography';
import { Box } from '~components/Box';

describe('<InfoGroup />', () => {
  it('should render simple InfoGroup', () => {
    const { container } = renderWithTheme(
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
    expect(container).toMatchSnapshot();
  });

  it('should render InfoGroup with itemOrientation="vertical"', () => {
    const { container } = renderWithTheme(
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
    expect(container).toMatchSnapshot();
  });

  it('should render InfoGroup with gridTemplateColumns="50% 50%"', () => {
    const { container } = renderWithTheme(
      <InfoGroup gridTemplateColumns="50% 50%">
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
    expect(container).toMatchSnapshot();
  });

  it('should render complex InfoGroup with horizontal itemOrientation, leading/trailing props, helpText, etc', () => {
    const { container } = renderWithTheme(
      <InfoGroup
        itemOrientation="horizontal"
        size="medium"
        keyAlign="left"
        valueAlign="right"
        isHighlighted={true}
        maxWidth="600px"
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
    expect(container).toMatchSnapshot();
  });

  it('should render InfoGroup with Avatars and apply correct padding to InfoItemKey and InfoItemValue', () => {
    const { container, getByTestId } = renderWithTheme(
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
          <InfoItemKey
            leading={<Avatar size="medium" name="Bank Account" />}
            testID="info-item-key-with-avatar-2"
          >
            Payment ID
          </InfoItemKey>
          <InfoItemValue
            trailing={<Link icon={CopyIcon} variant="button" size="medium" />}
            testID="info-item-value-with-avatar-2"
          >
            <Code weight="bold" size="small">
              pay_MK7DGqwYXEwx9Q
            </Code>
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey
            testID="info-item-key-with-non-avatar"
            leading={<span>Non Avatar element</span>}
          >
            Support Agent
          </InfoItemKey>
          <InfoItemValue testID="info-item-value-with-non-avatar">John Doe</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );

    expect(container).toMatchSnapshot();

    // Check that InfoItemKey has correct padding when Avatar is present (test first 2 items)
    const infoItemKey1 = getByTestId('info-item-key-with-avatar-1');
    const infoItemKey2 = getByTestId('info-item-key-with-avatar-2');

    const computedStyleKey1 = window.getComputedStyle(infoItemKey1);
    // For medium size, avatarAdjustmentPaddingY is 'spacing.2' which is 8px
    expect(computedStyleKey1.paddingTop).toBe('4px');
    expect(computedStyleKey1.paddingBottom).toBe('4px');

    const computedStyleKey2 = window.getComputedStyle(infoItemKey2);
    // For medium size, avatarAdjustmentPaddingY is 'spacing.2' which is 8px
    expect(computedStyleKey2.paddingTop).toBe('4px');
    expect(computedStyleKey2.paddingBottom).toBe('4px');

    // Check that InfoItemValue has correct padding when Avatar is present (test first 2 items)
    const infoItemValue1 = getByTestId('info-item-value-with-avatar-1');
    const infoItemValue2 = getByTestId('info-item-value-with-avatar-2');

    const computedStyleValue1 = window.getComputedStyle(infoItemValue1);
    // For medium size, avatarAdjustmentPaddingY is 'spacing.2' which is 8px
    expect(computedStyleValue1.paddingTop).toBe('4px');
    expect(computedStyleValue1.paddingBottom).toBe('4px');

    const computedStyleValue2 = window.getComputedStyle(infoItemValue2);
    // For medium size, avatarAdjustmentPaddingY is 'spacing.2' which is 8px
    expect(computedStyleValue2.paddingTop).toBe('4px');
    expect(computedStyleValue2.paddingBottom).toBe('4px');

    // When there is no avatar, the padding should be 0
    const infoItemValue3 = getByTestId('info-item-value-with-non-avatar');
    const computedStyleValue3 = window.getComputedStyle(infoItemValue3);
    expect(computedStyleValue3.paddingTop).toBeFalsy();
    expect(computedStyleValue3.paddingBottom).toBeFalsy();
  });

  it('should accept testID', () => {
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
    const { container } = renderWithTheme(
      <Box>
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
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render InfoGroup with different alignments', () => {
    const { container } = renderWithTheme(
      <div>
        <InfoGroup keyAlign="left" valueAlign="left">
          <InfoItem>
            <InfoItemKey>Account Holder</InfoItemKey>
            <InfoItemValue>Saurabh Daware</InfoItemValue>
          </InfoItem>
        </InfoGroup>
        <InfoGroup keyAlign="left" valueAlign="right">
          <InfoItem>
            <InfoItemKey>Account Holder</InfoItemKey>
            <InfoItemValue>Saurabh Daware</InfoItemValue>
          </InfoItem>
        </InfoGroup>
        <InfoGroup keyAlign="right" valueAlign="right">
          <InfoItem>
            <InfoItemKey>Account Holder</InfoItemKey>
            <InfoItemValue>Saurabh Daware</InfoItemValue>
          </InfoItem>
        </InfoGroup>
      </div>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(
      <InfoGroup>
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
    await assertAccessible(container);
  });
});
