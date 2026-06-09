import { Timestamp } from '../Timestamp';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

// Fixed date for deterministic test output
const FIXED_DATE = new Date('2026-05-30T13:08:32.000Z');

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Timestamp /> (native)', () => {
  it('should render Timestamp with default props', () => {
    const { toJSON } = renderWithTheme(<Timestamp value={FIXED_DATE} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with format="date"', () => {
    const { toJSON } = renderWithTheme(<Timestamp value={FIXED_DATE} format="date" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with format="time"', () => {
    const { toJSON } = renderWithTheme(<Timestamp value={FIXED_DATE} format="time" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with format="relative"', () => {
    jest.useFakeTimers().setSystemTime(FIXED_DATE);
    const fiveMinAgo = new Date(FIXED_DATE.getTime() - 5 * 60 * 1000);
    const { toJSON } = renderWithTheme(<Timestamp value={fiveMinAgo} format="relative" />);
    expect(toJSON()).toMatchSnapshot();
    jest.useRealTimers();
  });

  it('should render all type × size combinations', () => {
    const { toJSON } = renderWithTheme(
      <>
        <Timestamp value={FIXED_DATE} type="body" size="xsmall" />
        <Timestamp value={FIXED_DATE} type="body" size="small" />
        <Timestamp value={FIXED_DATE} type="body" size="medium" />
        <Timestamp value={FIXED_DATE} type="body" size="large" />
        <Timestamp value={FIXED_DATE} type="heading" size="small" />
        <Timestamp value={FIXED_DATE} type="heading" size="medium" />
        <Timestamp value={FIXED_DATE} type="heading" size="large" />
        <Timestamp value={FIXED_DATE} type="heading" size="xlarge" />
        <Timestamp value={FIXED_DATE} type="heading" size="2xlarge" />
        <Timestamp value={FIXED_DATE} type="display" size="small" />
        <Timestamp value={FIXED_DATE} type="display" size="medium" />
        <Timestamp value={FIXED_DATE} type="display" size="large" />
        <Timestamp value={FIXED_DATE} type="display" size="xlarge" />
      </>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should accept ISO string as value', () => {
    const { toJSON } = renderWithTheme(
      <Timestamp value="2026-05-30T13:08:32.000Z" format="date" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should accept Unix timestamp (ms) as value', () => {
    const { toJSON } = renderWithTheme(
      <Timestamp value={FIXED_DATE.getTime()} format="date" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should apply custom color', () => {
    const { toJSON } = renderWithTheme(
      <Timestamp value={FIXED_DATE} color="feedback.text.positive.intense" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should accept testID prop', () => {
    const { getByTestId } = renderWithTheme(
      <Timestamp value={FIXED_DATE} testID="timestamp-native-test" />,
    );
    expect(getByTestId('timestamp-native-test')).toBeTruthy();
  });

  it('should throw an error for invalid date value in __DEV__', () => {
    expect(() => {
      renderWithTheme(<Timestamp value="not-a-date" />);
    }).toThrow('[Blade: Timestamp]');
  });

  it('should render nothing for invalid date value in production', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = global as any;
    const originalDev = g.__DEV__;
    g.__DEV__ = false;
    const { toJSON } = renderWithTheme(<Timestamp value="not-a-date" />);
    expect(toJSON()).toBeNull();
    g.__DEV__ = originalDev;
  });

  it('should throw __DEV__ error for invalid type × size combination', () => {
    expect(() => {
      // @ts-expect-error intentionally invalid combination
      renderWithTheme(<Timestamp value={FIXED_DATE} type="body" size="2xlarge" />);
    }).toThrow('[Blade: Timestamp]');

    expect(() => {
      // @ts-expect-error intentionally invalid combination
      renderWithTheme(<Timestamp value={FIXED_DATE} type="heading" size="xsmall" />);
    }).toThrow('[Blade: Timestamp]');

    expect(() => {
      // @ts-expect-error intentionally invalid combination
      renderWithTheme(<Timestamp value={FIXED_DATE} type="display" size="2xlarge" />);
    }).toThrow('[Blade: Timestamp]');
  });

  it('should render with hourCycle="24h"', () => {
    const { toJSON } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="time" hourCycle="24h" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with precision="second"', () => {
    const { toJSON } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="time" precision="second" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should NOT render a <time> element on native (no semantic HTML)', () => {
    const { toJSON } = renderWithTheme(<Timestamp value={FIXED_DATE} />);
    const json = JSON.stringify(toJSON());
    // Native renders no HTML elements — no "time" tag should appear
    expect(json).not.toContain('"type":"time"');
  });
});
