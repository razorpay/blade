import React from 'react';
import userEvents from '@testing-library/user-event';
import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import { SkipNavContent, SkipNavLink } from '../SkipNav.web';

describe('<SkipNav />', () => {
  it('<SkipNavLink /> should render correctly', () => {
    const { getByRole } = renderWithTheme(<SkipNavLink />);

    expect(getByRole('link')).toHaveTextContent('Skip to content');
  });

  it('<SkipNavLink /> should render correctly with children', () => {
    const { getByRole } = renderWithTheme(<SkipNavLink children="Skip" />);

    expect(getByRole('link')).toHaveTextContent('Skip');
  });

  it('<SkipNavContent /> should render correctly', () => {
    const { getByTestId } = renderWithTheme(<SkipNavContent />);

    expect(getByTestId('skipnav-content')).toHaveAttribute('tabindex', '-1');
  });

  it('should skip to main navigation', async () => {
    jest.useRealTimers();
    const user = userEvents.setup();
    const { getByRole, getByTestId } = renderWithTheme(
      <div>
        <nav>
          <SkipNavLink id="custom-id" />
          <button>one</button>
          <button>two</button>
        </nav>
        <main>
          <SkipNavContent id="custom-id" />
          <button>main content</button>
        </main>
      </div>,
    );

    // TODO: move to ariakit-utils after this is fixed:
    // https://github.com/ariakit/ariakit/issues/1483
    await user.tab();
    expect(getByRole('link')).toHaveFocus();

    await user.tab();
    expect(getByRole('button', { name: 'one' })).toHaveFocus();

    await user.tab({ shift: true });
    expect(getByRole('link')).toHaveFocus();

    await user.click(getByRole('link'));
    expect(window.location.hash).toBe('#custom-id');

    // Can't test for focus because jsdom doesn't move focus to fragment anchor elements
    // expect(getByTestId('skipnav-content')).toHaveFocus();
    expect(getByTestId('skipnav-content')).toHaveAttribute('id', 'custom-id');
  });
});
