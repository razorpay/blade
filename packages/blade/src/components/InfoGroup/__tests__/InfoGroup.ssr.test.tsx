/**
 * @jest-environment node
 */

import { InfoGroup, InfoItem, InfoItemKey, InfoItemValue } from '../InfoGroup';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { BankIcon, UserIcon } from '~components/Icons';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';

describe('<InfoGroup /> SSR', () => {
  it('should render basic InfoGroup', () => {
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

  it('should render InfoGroup with complex content', () => {
    const { container } = renderWithSSR(
      <InfoGroup>
        <InfoItem>
          <InfoItemKey leading={UserIcon} helpText="Customer information">
            Account Holder
          </InfoItemKey>
          <InfoItemValue helpText="Name of the account holder">Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey leading={BankIcon}>Payment ID</InfoItemKey>
          <InfoItemValue>
            <Code weight="bold">pay_MK7DGqwYXEwx9Q</Code>
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Status</InfoItemKey>
          <InfoItemValue>
            <Badge color="positive">Active</Badge>
          </InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render InfoGroup with vertical orientation', () => {
    const { container } = renderWithSSR(
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
          <InfoItemKey>Account Number</InfoItemKey>
          <InfoItemValue>1234567890</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Branch</InfoItemKey>
          <InfoItemValue>Koramangala</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(container).toMatchSnapshot();
  });
});
