/**
 * SSR tests for <Timestamp />.
 *
 * We intentionally do NOT use renderWithSSR (from ~utils/testing/renderWithSSR.web) because
 * that utility hardcodes `expect(html).toMatchSnapshot()` and the snapshot format differs
 * between local Jest v29 (escapes quotes as \") and CI Jest v30 (leaves quotes unescaped).
 * Rather than maintaining a snapshot file that only works on one environment, we replicate
 * the SSR renderToString step and make explicit DOM assertions using jsdom directly.
 *
 * We also use format="date" throughout to avoid timezone-sensitive output:
 * format="dateTime" renders the time portion in the local timezone, producing
 * "9:20 am" on IST machines but "3:50 am" on UTC (CI), which would break assertions.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderToString } from 'react-dom/server';
import jsdom from 'jsdom';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';
import { Timestamp } from '..';

// Fixed date for deterministic output — 2025-03-21 UTC
// format="date" → no time component → timezone-invariant output safe to assert on
const FIXED_DATE = new Date('2025-03-21T03:50:00.000Z');

/**
 * Renders the component to an SSR HTML string, then injects it into a fresh jsdom
 * document so we can run DOM queries. Does NOT run React hydration — the hydration
 * path is covered by the web tests.
 */
const renderSSR = (ui: React.ReactElement): jsdom.JSDOM => {
  const App = (): React.ReactElement => (
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      {ui}
    </BladeProvider>
  );

  const html = renderToString(<App />);

  const dom = new jsdom.JSDOM(`<!DOCTYPE html><body><div id="root">${html}</div></body>`, {
    url: 'http://localhost/',
  });

  return dom;
};

/** Query helper so tests don't need to reach into dom.window.document */
const q = (dom: jsdom.JSDOM, selector: string): Element | null =>
  dom.window.document.querySelector(selector);

describe('<Timestamp />', () => {
  it('should render Timestamp on server with en-IN locale', () => {
    const dom = renderSSR(<Timestamp value={FIXED_DATE} format="date" locale="en-IN" />);

    // Semantic <time> element with machine-readable ISO attribute
    const timeEl = q(dom, 'time');
    expect(timeEl).toBeTruthy();
    expect(timeEl?.getAttribute('datetime')).toMatch(/2025-03-21T\d{2}:\d{2}:\d{2}/);

    // Visible text renders the date using en-IN locale (medium style = "21 Mar 2025")
    expect(dom.window.document.body.textContent).toMatch(/21 Mar 2025/);

    // Blade component marker
    expect(q(dom, '[data-blade-component="timestamp"]')).toBeTruthy();
  });

  it('should render a <time> element with ISO datetime attribute on SSR', () => {
    const dom = renderSSR(<Timestamp value={FIXED_DATE} format="date" locale="en-US" />);

    const timeEl = q(dom, 'time');
    expect(timeEl).toBeTruthy();
    expect(timeEl?.getAttribute('datetime')).toBe(FIXED_DATE.toISOString());
  });

  it('should render format="date" with no time text', () => {
    const dom = renderSSR(<Timestamp value={FIXED_DATE} format="date" locale="en-US" />);
    const text = dom.window.document.body.textContent ?? '';

    // Date-only — no AM/PM or colons from a time component
    expect(text).toMatch(/Mar/);
    expect(text).not.toMatch(/AM|PM|:/);
  });

  it('should return null for an invalid date value in production', () => {
    // In production (__DEV__ = false), invalid dates silently render nothing.
    // The SSR test env runs with __DEV__ = true by default, so we override it.
    const g = global as any;
    const originalDev = g.__DEV__;
    g.__DEV__ = false;
    const dom = renderSSR(<Timestamp value="not-a-date" />);
    expect(q(dom, '[data-blade-component="timestamp"]')).toBeNull();
    g.__DEV__ = originalDev;
  });

  it('should throw for an invalid date in __DEV__', () => {
    expect(() => {
      renderSSR(<Timestamp value="not-a-date" />);
    }).toThrow('[Blade: Timestamp]');
  });
});
