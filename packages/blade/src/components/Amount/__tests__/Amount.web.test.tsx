import { setState } from '@razorpay/i18nify-js';
import { I18nProvider } from '@razorpay/i18nify-react';
import type { AmountProps } from '../Amount';
import { Amount, getAmountByParts } from '../Amount';
import { AMOUNT_SUFFIX_TEST_SET } from './mock';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

const I18nAmountWrapper = (args: AmountProps & { locale?: string }): JSX.Element => {
  return (
    <I18nProvider initData={{ locale: args.locale }}>
      <Amount {...args} />
    </I18nProvider>
  );
};

describe('<Amount />', () => {
  it('should render Amount with default props', () => {
    const { container } = renderWithTheme(<Amount value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render Amount with negative value', () => {
    const { container } = renderWithTheme(<Amount value={-10000} />);
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

  it('should throw an error when invalid type and size is passed', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    // @ts-expect-error testing failure case when value is passed as a string
    expect(() => renderWithTheme(<Amount value={1000} type="display" size="2xlarge" />)).toThrow(
      '[Blade: Amount]: size="2xlarge" is not allowed with type="display"',
    );
    // @ts-expect-error testing failure case when value is passed as a string
    expect(() => renderWithTheme(<Amount value={1000} type="heading" size="xsmall" />)).toThrow(
      '[Blade: Amount]: size="xsmall" is not allowed with type="heading"',
    );
    mockConsoleError.mockRestore();

    // @ts-expect-error testing failure case when value is passed as a string
    expect(() => renderWithTheme(<Amount value={1000} type="body" size="2xlarge" />)).toThrow(
      '[Blade: Amount]: size="2xlarge" is not allowed with type="body"',
    );
    mockConsoleError.mockRestore();
  });

  it('should render body-small size Amount', () => {
    const { container } = renderWithTheme(<Amount type="body" size="small" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render body-small-bold size Amount', () => {
    const { container } = renderWithTheme(
      <Amount type="body" size="small" weight="semibold" value={1000} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render body-medium size Amount', () => {
    const { container } = renderWithTheme(<Amount type="body" size="medium" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render body-medium-bold size Amount', () => {
    const { container } = renderWithTheme(
      <>
        <Amount type="body" size="medium" value={1000} />
        <Amount type="body" size="medium" weight="semibold" value={1000} />
        <Amount type="body" size="small" value={1000} />
        <Amount type="body" size="small" weight="semibold" value={1000} />
        <Amount type="heading" size="large" value={1000} />
        <Amount type="heading" size="large" weight="semibold" value={1000} />
        <Amount type="heading" size="small" value={1000} />
        <Amount type="heading" size="small" weight="semibold" value={1000} />
        <Amount type="display" size="medium" value={1000} />
      </>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render isStrikethrough={true}', () => {
    const { container } = renderWithTheme(<Amount isStrikethrough={true} value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render currencyIndicator="currency-symbol"', () => {
    const { container } = renderWithTheme(
      <Amount currencyIndicator="currency-symbol" value={1000} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render currencyIndicator="currency-code"', () => {
    const { container } = renderWithTheme(
      <Amount currencyIndicator="currency-code" value={1000} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render amount with Humanize value', () => {
    const { container } = renderWithTheme(
      <Amount type="display" size="medium" suffix="humanize" value={1000.22} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render positive intent Amount ', () => {
    const { container } = renderWithTheme(
      <Amount color="feedback.text.positive.intense" value={1000} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render negative intent Amount ', () => {
    const { container } = renderWithTheme(
      <Amount isAffixSubtle={false} color="feedback.text.negative.intense" value={1000} />,
    );
    expect(container).toMatchSnapshot();
  });

  /**
   * Regression test for: isAffixSubtle=false not working for body type currency prefix.
   * When isAffixSubtle=false, the currency symbol (₹) must render at the same font-size
   * as the amount integer — not at the subtle (smaller) size.
   *
   * Root cause: currencyHardcodedSizes.body had pixel values equal to the subtle sizes
   * (10px) that were being incorrectly applied to body type even when isAffixSubtle=false,
   * making the currency symbol smaller than the amount number.
   *
   * @see https://app.devrev.ai/razorpay/works/TKT-4549930
   */
  it('should render currency prefix at same size as amount when isAffixSubtle={false} and type="body"', () => {
    const { container } = renderWithTheme(
      <Amount type="body" size="medium" isAffixSubtle={false} value={12500.45} />,
    );
    // Snapshot verifies both currency (₹) and amount spans share the same CSS class
    // (same font-size: 0.875rem), not the subtle smaller size (0.625rem).
    expect(container).toMatchSnapshot();
  });

  for (const currency of ['USD', 'MYR', 'AED']) {
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

  it('should check if formatAmountWithSuffix is returning the right value for humanize decimals and none', () => {
    setState({ locale: 'en-IN' });
    expect(getAmountByParts({ value: 1000.22, suffix: 'humanize', currency: 'INR' })).toEqual({
      compact: 'K',
      currency: '₹',
      integer: '1',
      isPrefixSymbol: true,
      rawParts: [
        { type: 'currency', value: '₹' },
        { type: 'integer', value: '1' },
        { type: 'compact', value: 'K' },
      ],
    });
    expect(getAmountByParts({ value: 1000000.0, suffix: 'decimals', currency: 'INR' })).toEqual({
      currency: '₹',
      decimal: '.',
      fraction: '00',
      integer: '10,00,000',
      isPrefixSymbol: true,
      rawParts: [
        { type: 'currency', value: '₹' },
        { type: 'integer', value: '10' },
        { type: 'group', value: ',' },
        { type: 'integer', value: '00' },
        { type: 'group', value: ',' },
        { type: 'integer', value: '000' },
        { type: 'decimal', value: '.' },
        { type: 'fraction', value: '00' },
      ],
    });
    expect(getAmountByParts({ value: 10000000, suffix: 'none', currency: 'INR' }).integer).toBe(
      '1,00,00,000',
    );
    // Related issue - https://github.com/razorpay/blade/issues/1572
    expect(getAmountByParts({ value: 2.07, suffix: 'decimals', currency: 'INR' })).toEqual({
      currency: '₹',
      decimal: '.',
      fraction: '07',
      integer: '2',
      isPrefixSymbol: true,
      rawParts: [
        { type: 'currency', value: '₹' },
        { type: 'integer', value: '2' },
        { type: 'decimal', value: '.' },
        { type: 'fraction', value: '07' },
      ],
    });
    expect(getAmountByParts({ value: 2.077, suffix: 'decimals', currency: 'INR' })).toEqual({
      currency: '₹',
      decimal: '.',
      fraction: '08',
      integer: '2',
      isPrefixSymbol: true,
      rawParts: [
        { type: 'currency', value: '₹' },
        { type: 'integer', value: '2' },
        { type: 'decimal', value: '.' },
        { type: 'fraction', value: '08' },
      ],
    });
    expect(getAmountByParts({ value: 2.3, suffix: 'decimals', currency: 'INR' })).toEqual({
      currency: '₹',
      decimal: '.',
      fraction: '30',
      integer: '2',
      isPrefixSymbol: true,
      rawParts: [
        { type: 'currency', value: '₹' },
        { type: 'integer', value: '2' },
        { type: 'decimal', value: '.' },
        { type: 'fraction', value: '30' },
      ],
    });
  });

  it('should allow customizing number of fraction digits', () => {
    setState({ locale: 'en-IN' });
    // Test with 3 decimal places
    expect(
      getAmountByParts({ value: 123.456, suffix: 'decimals', currency: 'INR', fractionDigits: 3 }),
    ).toEqual({
      currency: '₹',
      decimal: '.',
      fraction: '456',
      integer: '123',
      isPrefixSymbol: true,
      rawParts: [
        { type: 'currency', value: '₹' },
        { type: 'integer', value: '123' },
        { type: 'decimal', value: '.' },
        { type: 'fraction', value: '456' },
      ],
    });

    // Test with 4 decimal places
    expect(
      getAmountByParts({ value: 123.4567, suffix: 'decimals', currency: 'INR', fractionDigits: 4 }),
    ).toEqual({
      currency: '₹',
      decimal: '.',
      fraction: '4567',
      integer: '123',
      isPrefixSymbol: true,
      rawParts: [
        { type: 'currency', value: '₹' },
        { type: 'integer', value: '123' },
        { type: 'decimal', value: '.' },
        { type: 'fraction', value: '4567' },
      ],
    });

    // Test with 0 decimal places
    expect(
      getAmountByParts({ value: 123.456, suffix: 'decimals', currency: 'INR', fractionDigits: 0 }),
    ).toEqual({
      currency: '₹',
      integer: '123',
      isPrefixSymbol: true,
      rawParts: [
        { type: 'currency', value: '₹' },
        { type: 'integer', value: '123' },
      ],
    });
  });

  it('should display the correct number of decimal places based on fractionDigits prop', () => {
    setState({ locale: 'en-IN' });

    const { getByTestId: getByTestId1 } = renderWithTheme(
      <Amount value={123.456789} fractionDigits={1} testID="amount-one-decimal" />,
    );
    expect(getByTestId1('amount-one-decimal')).toHaveTextContent('₹123.5');

    const { getByTestId: getByTestId3 } = renderWithTheme(
      <Amount value={123.456789} fractionDigits={3} testID="amount-three-decimals" />,
    );
    expect(getByTestId3('amount-three-decimals')).toHaveTextContent('₹123.457');

    const { getByTestId: getByTestId0 } = renderWithTheme(
      <Amount value={123.456789} fractionDigits={0} testID="amount-zero-decimals" />,
    );
    expect(getByTestId0('amount-zero-decimals')).toHaveTextContent('₹123');
  });

  it.each(AMOUNT_SUFFIX_TEST_SET)(
    `should render different outputs in Amount for different suffix values`,
    (item) => {
      const { getByTestId } = renderWithTheme(
        <I18nAmountWrapper
          value={item.value}
          suffix={item.suffix}
          testID="amount-test"
          locale={item.locale}
          fractionDigits={item.fractionDigits}
        />,
      );

      expect(getByTestId('amount-test')).toHaveTextContent(item.output);
    },
  );
  it('should automatically determine fraction digits based on currency when fractionDigits="auto"', () => {
    setState({ locale: 'en-IN' });

    // JPY has 0 decimal places
    const { getByTestId: getJPY } = renderWithTheme(
      <Amount value={1000} currency="JPY" fractionDigits="auto" testID="amount-jpy" />,
    );
    expect(getJPY('amount-jpy')).toHaveTextContent('¥1,000');

    // INR has 2 decimal places
    const { getByTestId: getINR } = renderWithTheme(
      <Amount value={1000} currency="INR" fractionDigits="auto" testID="amount-inr" />,
    );
    expect(getINR('amount-inr')).toHaveTextContent('₹1,000.00');

    // KWD has 3 decimal places
    const { getByTestId: getKWD } = renderWithTheme(
      <Amount value={1000} currency="KWD" fractionDigits="auto" testID="amount-kwd" />,
    );
    expect(getKWD('amount-kwd')).toHaveTextContent('1,000.000');
  });

  it('should render amount with data-analytics attributes', () => {
    const { getByTestId } = renderWithTheme(
      <Amount value={1000} testID="amount-test" data-analytics-test="dummy" />,
    );

    expect(getByTestId('amount-test')).toHaveAttribute('data-analytics-test', 'dummy');
  });
});
