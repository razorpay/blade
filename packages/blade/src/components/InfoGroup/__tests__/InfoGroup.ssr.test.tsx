import React from 'react';
import { InfoGroup, InfoItem, InfoItemKey, InfoItemValue } from '../InfoGroup';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { UserIcon, BankIcon } from '~components/Icons';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';

describe('<InfoGroup />', () => {
  it('should render InfoGroup on server', () => {
    const { container } = renderWithSSR(
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

    expect(container).toMatchSnapshot();
  });

  it('should render InfoGroup with vertical orientation on server', () => {
    const { container } = renderWithSSR(
      <InfoGroup itemOrientation="vertical">
        <InfoItem>
          <InfoItemKey>Account Holder</InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Status</InfoItemKey>
          <InfoItemValue>Active</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render complex InfoGroup on server', () => {
    const { container } = renderWithSSR(
      <InfoGroup
        itemOrientation="horizontal"
        size="medium"
        keyAlign="left"
        valueAlign="right"
        gridTemplateColumns="40% 60%"
      >
        <InfoItem>
          <InfoItemKey leading={UserIcon} helpText="Customer information">
            Account Holder
          </InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey leading={BankIcon} helpText="Payment method">
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
          <InfoItemKey helpText="Transaction amount">Amount</InfoItemKey>
          <InfoItemValue>
            <Amount value={123456} size="medium" />
          </InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );

    expect(container).toMatchSnapshot();
  });
});
