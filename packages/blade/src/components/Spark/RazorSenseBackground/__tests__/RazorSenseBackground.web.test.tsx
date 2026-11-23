import React from 'react';
import { waitFor } from '@testing-library/react';
import { RazorSenseBackground } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme';
import { bladeTheme } from '~tokens/theme';
import { BladeProvider } from '~components/BladeProvider';

jest.mock('../stills/backgroundLight', () => ({ backgroundLight: 'still:backgroundLight' }));
jest.mock('../stills/backgroundDark', () => ({ backgroundDark: 'still:backgroundDark' }));

// (jsdom lays nothing out: the box is the login page's reference size)
beforeAll(() => {
  jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1512);
  jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(862);
});
afterAll(() => jest.restoreAllMocks());

const stillOf = (container: HTMLElement): HTMLImageElement => {
  const img = container.querySelector<HTMLImageElement>(
    '[data-blade-component="razorsense-background"] img',
  );
  if (!img) throw new Error('its still has not loaded yet');
  return img;
};

describe('<RazorSenseBackground /> (jsdom has no WebGL2: its still)', () => {
  it('is decorative, fills its box and forwards ref, className, style and testID', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = renderWithTheme(
      <RazorSenseBackground ref={ref} className="page-bg" style={{ zIndex: 0 }} testID="bg" />,
    );
    const root = container.querySelector<HTMLElement>(
      '[data-blade-component="razorsense-background"]',
    );
    expect(root).toBe(ref.current);
    expect(root?.getAttribute('aria-hidden')).toBe('true');
    expect(root?.className).toBe('page-bg');
    expect(root?.getAttribute('data-testid')).toBe('bg');
    expect(root?.style.zIndex).toBe('0');
    expect(root?.style.width).toBe('100%');
    expect(root?.style.overflow).toBe('hidden');
  });

  it('can’t animate here: says why, and shows its still placed as the piece is (scaled and turned with it)', async () => {
    const onError = jest.fn();
    const { container } = renderWithTheme(<RazorSenseBackground onError={onError} />);
    const still = await waitFor(() => stillOf(container));
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(still.getAttribute('src')).toBe('still:backgroundLight');
    // the whole piece at 0.5 CSS px per comp px on a 1512 x 862 box, the login mirror's turn and scale round the box's middle
    await waitFor(() => expect(still.style.width).toBe('1901px'));
    expect(still.style.height).toBe('2035px');
    expect(still.style.transform).toBe('translate(0px, 0px) rotate(3.5deg) scale(0.89)');
  });

  it('dark: its own still', async () => {
    const { container } = renderWithTheme(
      <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
        <RazorSenseBackground />
      </BladeProvider>,
    );
    await waitFor(() =>
      expect(stillOf(container).getAttribute('src')).toBe('still:backgroundDark'),
    );
  });
});
