/**
 * @jest-environment node
 */

import { renderToString } from 'react-dom/server';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';
import { SliderInput } from '../index';

describe('<SliderInput />', () => {
  it('should render SliderInput on server without errors', () => {
    const html = renderToString(
      <BladeProvider themeTokens={bladeTheme} colorScheme="light">
        <SliderInput label="Corner Radius" value={12} onChange={() => undefined} min={0} max={24} />
      </BladeProvider>,
    );
    expect(html).toContain('slider-input');
    expect(html).toContain('Corner Radius');
    expect(html).toContain('role="slider"');
    expect(html).toContain('aria-valuenow="12"');
  });
});
