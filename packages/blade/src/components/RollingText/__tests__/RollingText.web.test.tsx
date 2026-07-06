import React from 'react';
import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { RollingText } from '../RollingText.web';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

const renderWithDarkTheme = (ui: React.ReactElement): RenderResult =>
  render(
    <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
      {ui}
    </BladeProvider>,
  );

describe('<RollingText />', () => {
  it('renders a single text item without animation wrapper', () => {
    const { getByText } = renderWithTheme(<RollingText texts={['Hello']} />);
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('renders the first text item when multiple texts are provided', () => {
    const { getByText } = renderWithTheme(
      <RollingText texts={['First text', 'Second text', 'Third text']} />,
    );
    expect(getByText('First text')).toBeInTheDocument();
  });

  it('does not render shimmer when showShimmer is false', () => {
    const { container } = renderWithTheme(
      <RollingText texts={['Hello', 'World']} showShimmer={false} />,
    );
    // aria-hidden span is the shimmer overlay; it should not exist when showShimmer=false
    const shimmer = container.querySelector('[aria-hidden="true"]');
    expect(shimmer).not.toBeInTheDocument();
  });

  it('renders shimmer overlay when showShimmer is true (default)', () => {
    const { container } = renderWithTheme(<RollingText texts={['Hello', 'World']} />);
    const shimmer = container.querySelector('[aria-hidden="true"]');
    expect(shimmer).toBeInTheDocument();
  });

  it('renders shimmer in dark mode without throwing', () => {
    const { container } = renderWithDarkTheme(<RollingText texts={['Hello', 'World']} />);
    const shimmer = container.querySelector('[aria-hidden="true"]');
    expect(shimmer).toBeInTheDocument();
  });

  it('matches snapshot in light mode with shimmer', () => {
    const { container } = renderWithTheme(<RollingText texts={['Hello', 'World']} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot in dark mode with shimmer', () => {
    const { container } = renderWithDarkTheme(<RollingText texts={['Hello', 'World']} />);
    expect(container).toMatchSnapshot();
  });

  it('renders custom children via render prop', () => {
    const { getByText } = renderWithTheme(
      <RollingText texts={['Hello', 'World']}>{(text) => <strong>{text}</strong>}</RollingText>,
    );
    expect(getByText('Hello')).toBeInTheDocument();
  });
});
