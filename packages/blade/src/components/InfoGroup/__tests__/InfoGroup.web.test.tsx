import type { InfoGroupProps } from '../types';
import { InfoGroup, InfoItem, InfoItemKey, InfoItemValue } from '../InfoGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { UserIcon, BankIcon, CheckIcon, CopyIcon } from '~components/Icons';
import { Code } from '~components/Typography';
import { Avatar } from '~components/Avatar';
import { Badge } from '~components/Badge';
import { Amount } from '~components/Amount';
import { Divider } from '~components/Divider';

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
      </InfoGroup>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render InfoGroup with different item orientations', () => {
    const { container: horizontalContainer } = renderWithTheme(
      <InfoGroup itemOrientation="horizontal">
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

    const { container: verticalContainer } = renderWithTheme(
      <InfoGroup itemOrientation="vertical">
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

    expect(horizontalContainer).toMatchSnapshot();
    expect(verticalContainer).toMatchSnapshot();
  });

  it('should render InfoGroup with different sizes', () => {
    const sizes: InfoGroupProps['size'][] = ['xsmall', 'small', 'medium', 'large'];

    sizes.forEach((size) => {
      const { container } = renderWithTheme(
        <InfoGroup size={size}>
          <InfoItem>
            <InfoItemKey>Account Holder</InfoItemKey>
            <InfoItemValue>Saurabh Daware</InfoItemValue>
          </InfoItem>
        </InfoGroup>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render InfoGroup with different key and value alignments', () => {
    const { container } = renderWithTheme(
      <InfoGroup keyAlign="right" valueAlign="right">
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

  it('should render InfoGroup with highlighting', () => {
    const { container } = renderWithTheme(
      <InfoGroup isHighlighted={true}>
        <InfoItem>
          <InfoItemKey>Account Holder</InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem isHighlighted={false}>
          <InfoItemKey>Payment Method</InfoItemKey>
          <InfoItemValue>Credit Card</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render InfoGroup with custom grid template columns', () => {
    const { container } = renderWithTheme(
      <InfoGroup gridTemplateColumns="1fr 2fr">
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

  it('should render InfoGroup with icons and help text', () => {
    const { container } = renderWithTheme(
      <InfoGroup>
        <InfoItem>
          <InfoItemKey leading={UserIcon} helpText="Customer information">
            Account Holder
          </InfoItemKey>
          <InfoItemValue helpText="Name of the account holder" trailing={CheckIcon}>
            Saurabh Daware
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey leading={BankIcon}>Payment ID</InfoItemKey>
          <InfoItemValue trailing={CopyIcon}>
            <Code weight="bold">pay_MK7DGqwYXEwx9Q</Code>
          </InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render InfoGroup with complex content', () => {
    const { container } = renderWithTheme(
      <InfoGroup>
        <InfoItem>
          <InfoItemKey leading={UserIcon}>Customer</InfoItemKey>
          <InfoItemValue>
            <Avatar name="Saurabh Daware" />
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Status</InfoItemKey>
          <InfoItemValue>
            <Badge color="positive">Active</Badge>
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Amount</InfoItemKey>
          <InfoItemValue>
            <Amount value={123456} />
          </InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render InfoGroup with dividers', () => {
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
        <Divider gridColumn="span 2" />
        <InfoItem>
          <InfoItemKey>Status</InfoItemKey>
          <InfoItemValue>Completed</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render InfoGroup with width and padding props', () => {
    const { container } = renderWithTheme(
      <InfoGroup width="400px" maxWidth="500px" padding="spacing.4" paddingX="spacing.6">
        <InfoItem>
          <InfoItemKey>Account Holder</InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should apply correct grid template columns based on itemOrientation', () => {
    const { getByTestId: getHorizontal } = renderWithTheme(
      <InfoGroup itemOrientation="horizontal" testID="horizontal-info-group">
        <InfoItem>
          <InfoItemKey>Key</InfoItemKey>
          <InfoItemValue>Value</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );

    const { getByTestId: getVertical } = renderWithTheme(
      <InfoGroup itemOrientation="vertical" testID="vertical-info-group">
        <InfoItem>
          <InfoItemKey>Key1</InfoItemKey>
          <InfoItemValue>Value1</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Key2</InfoItemKey>
          <InfoItemValue>Value2</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );

    const horizontalElement = getHorizontal('horizontal-info-group');
    const verticalElement = getVertical('vertical-info-group');

    // Test computed styles for grid template columns
    expect(getComputedStyle(horizontalElement).gridTemplateColumns).toBe('max-content 1fr');
    expect(getComputedStyle(verticalElement).gridTemplateColumns).toBe('repeat(min(4,2),1fr)');
  });

  it('should apply correct gap spacing', () => {
    const { getByTestId } = renderWithTheme(
      <InfoGroup testID="info-group">
        <InfoItem>
          <InfoItemKey>Key</InfoItemKey>
          <InfoItemValue>Value</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );

    const element = getByTestId('info-group');
    const computedStyle = getComputedStyle(element);

    // rowGap should be spacing.4 = 12px
    expect(computedStyle.rowGap).toBe('12px');
    // columnGap should be spacing.6 = 20px (base)
    expect(computedStyle.columnGap).toBe('20px');
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <InfoGroup testID="info-group-test">
        <InfoItem testID="info-item-test">
          <InfoItemKey testID="info-key-test">Account Holder</InfoItemKey>
          <InfoItemValue testID="info-value-test">Saurabh Daware</InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );

    expect(getByTestId('info-group-test')).toBeTruthy();
    expect(getByTestId('info-item-test')).toBeTruthy();
    expect(getByTestId('info-key-test')).toBeTruthy();
    expect(getByTestId('info-value-test')).toBeTruthy();
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(
      <InfoGroup>
        <InfoItem>
          <InfoItemKey leading={UserIcon} helpText="Customer information">
            Account Holder
          </InfoItemKey>
          <InfoItemValue helpText="Name of the account holder" trailing={CheckIcon}>
            Saurabh Daware
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey leading={BankIcon}>Payment Method</InfoItemKey>
          <InfoItemValue>Credit Card</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Status</InfoItemKey>
          <InfoItemValue>
            <Badge color="positive">Active</Badge>
          </InfoItemValue>
        </InfoItem>
      </InfoGroup>,
    );

    await assertAccessible(container);
  });
});
