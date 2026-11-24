import React from 'react';
import { render } from '@testing-library/react';
import { RayLoader } from '../RayLoader';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

describe('<RayLoader />', () => {
  it('should render the loader with default props', () => {
    const { container } = renderWithTheme(<RayLoader />);
    expect(container).toMatchSnapshot();
  });

  it('should be a progress bar with its label while loading', () => {
    const { getByRole } = renderWithTheme(
      <RayLoader accessibilityLabel="Loading your settlements" />,
    );
    expect(getByRole('progressbar')).toHaveAttribute('aria-label', 'Loading your settlements');
  });

  it("should size its box: his path across its width, by default his charge, jump and floor's height", () => {
    const { getByRole } = renderWithTheme(<RayLoader width={600} />);
    const stage = getByRole('progressbar').firstElementChild;
    expect(stage).toHaveStyle({ width: '600px', height: '192px' }); // (medium: 48px wide, four of his widths tall)
    const small = renderWithTheme(<RayLoader size="small" testID="small-loader" />);
    expect(small.getByTestId('small-loader').firstElementChild).toHaveStyle({ height: '152px' });
  });

  it('should call onComplete once, at once, when loading ends where he cannot be drawn', () => {
    const onComplete = jest.fn();
    const ui = (isLoading: boolean): React.ReactElement => (
      <BladeProvider themeTokens={bladeTheme} colorScheme="light">
        <RayLoader testID="loader" isLoading={isLoading} onComplete={onComplete} />
      </BladeProvider>
    );
    const { rerender, getByTestId } = render(ui(true));
    expect(onComplete).not.toHaveBeenCalled();
    rerender(ui(false));
    expect(onComplete).toHaveBeenCalledTimes(1);
    rerender(ui(false));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(getByTestId('loader')).toHaveAttribute('aria-hidden', 'true'); // (done: off the accessibility tree)
  });
});
