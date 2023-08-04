import type { AmountProps } from '../Amount';
import {
  addCommas,
  Amount,
  formatAmountWithSuffix,
  getFlooredFixed,
  getHumanizedAmount,
} from '../Amount';
import { currencyPrefixMapping } from '../amountTokens';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<Amount />', () => {
  it('should render Amount with default props', () => {
    const { container } = renderWithTheme(<Amount value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<Amount value={1000} testID="amount-test" />);

    expect(getByTestId('amount-test')).toBeTruthy();
  });

  it('should throw an error when a string is passed', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    // @ts-expect-error testing failure case when value is passed as a string
    expect(() => renderWithTheme(<Amount value="10000" />)).toThrow(
      '[Blade: Amount]: `value` prop must be of type `number` for Amount.',
    );
    mockConsoleError.mockRestore();
  });

  it('should render body-small size Amount', () => {
    const { container } = renderWithTheme(<Amount size="body-small" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render body-small-bold size Amount', () => {
    const { container } = renderWithTheme(<Amount size="body-small-bold" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render body-medium size Amount', () => {
    const { container } = renderWithTheme(<Amount size="body-medium" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render body-medium-bold size Amount', () => {
    const { container } = renderWithTheme(
      <>
        <Amount size="body-medium" value={1000} />
        <Amount size="body-medium-bold" value={1000} />
        <Amount size="body-small" value={1000} />
        <Amount size="body-small-bold" value={1000} />
        <Amount size="heading-large" value={1000} />
        <Amount size="heading-large-bold" value={1000} />
        <Amount size="heading-small" value={1000} />
        <Amount size="heading-small-bold" value={1000} />
        <Amount size="title-medium" value={1000} />
      </>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render amount with Humanize value', () => {
    const { container } = renderWithTheme(
      <Amount size="title-medium" suffix="humanize" value={1000.22} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render positive intent Amount ', () => {
    const { container } = renderWithTheme(<Amount intent="positive" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render negative intent Amount ', () => {
    const { container } = renderWithTheme(
      <Amount isAffixSubtle={false} intent="negative" value={1000} />,
    );
    expect(container).toMatchSnapshot();
  });

  for (const currency of Object.keys(currencyPrefixMapping)) {
    it(`should render ${currency} currency Amount`, () => {
      const { container } = renderWithTheme(
        <Amount currency={currency as AmountProps['currency']} value={1000} />,
      );
      expect(container).toMatchSnapshot();
    });
  }

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(<Amount value={1000} />);
    await assertAccessible(container);
  });

  it('should check if getFlooredFixed is returning the floored value ', () => {
    expect(getFlooredFixed(1000.22, 2)).toBe(1000.22);
    expect(getFlooredFixed(1000.0, 2)).toBe(1000.0);
  });

  it('should check if addCommas is returning the value with commas', () => {
    expect(addCommas(1000.22, 'INR', 2)).toBe('1,000.22');
  });

  it('should check if getHumanizedAmount is returning the humanized value', () => {
    expect(getHumanizedAmount(1000.22, 'INR')).toBe('1k');
    expect(getHumanizedAmount(1000000, 'INR')).toBe('10L');
    expect(getHumanizedAmount(10000000, 'INR')).toBe('1Cr');
    expect(getHumanizedAmount(1000.22, 'MYR')).toBe('1K');
    expect(getHumanizedAmount(1000000, 'MYR')).toBe('1M');
    expect(getHumanizedAmount(10000000, 'MYR')).toBe('10M');
  });

  it('should check if formatAmountWithSuffix is returning the right value for humanize decimals and none', () => {
    expect(formatAmountWithSuffix({ value: 1000.22, currency: 'INR', suffix: 'humanize' })).toBe(
      '1k',
    );
    expect(formatAmountWithSuffix({ value: 1000000.0, currency: 'INR', suffix: 'decimals' })).toBe(
      '10,00,000.00',
    );
    expect(formatAmountWithSuffix({ value: 10000000, currency: 'INR', suffix: 'none' })).toBe(
      '1,00,00,000',
    );
    expect(formatAmountWithSuffix({ value: 1000.22, currency: 'MYR', suffix: 'humanize' })).toBe(
      '1K',
    );
    expect(formatAmountWithSuffix({ value: 1000000, currency: 'MYR', suffix: 'decimals' })).toBe(
      '1,000,000.00',
    );
    expect(formatAmountWithSuffix({ value: 10000000, currency: 'MYR', suffix: 'none' })).toBe(
      '10,000,000',
    );
  });
});
