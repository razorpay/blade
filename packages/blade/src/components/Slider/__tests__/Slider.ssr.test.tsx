import React from 'react';
import { Slider } from '../';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

// Use accessibilityLabel instead of label in SSR tests to avoid the htmlFor
// mismatch that Blade's module-level useId counter causes between renderToString
// and hydrate calls in the same test run.
describe('<Slider /> SSR', () => {
  it('renders without errors', () => {
    const { getByRole } = renderWithSSR(
      <Slider accessibilityLabel="Volume" defaultValue={40} />,
    );
    expect(getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
  });

  it('renders fill percentage correctly from first paint (no hydration flash)', () => {
    // value=40, min=0, max=100 → fillPct should be 40%
    const { getByRole } = renderWithSSR(
      <Slider accessibilityLabel="Volume" value={40} min={0} max={100} onChange={() => {}} />,
    );
    const slider = getByRole('slider', { name: 'Volume' });
    expect(slider.getAttribute('style')).toMatch(/--slider-fill-pct:\s*40%/);
  });

  it('handles min === max without crash (fillPct defaults to 0)', () => {
    const { getByRole } = renderWithSSR(
      <Slider accessibilityLabel="Static" value={50} min={50} max={50} onChange={() => {}} />,
    );
    const slider = getByRole('slider', { name: 'Static' });
    expect(slider.getAttribute('style')).toMatch(/--slider-fill-pct:\s*0%/);
  });

  it('matches snapshot', () => {
    // No errorText/helpText — those use useFormId IDs for aria-errormessage/aria-describedby
    // which cause server/client mismatch in the renderWithSSR test environment.
    const { container } = renderWithSSR(
      <Slider accessibilityLabel="Zoom" value={60} min={0} max={100} onChange={() => {}} />,
    );
    expect(container).toMatchSnapshot();
  });
});
