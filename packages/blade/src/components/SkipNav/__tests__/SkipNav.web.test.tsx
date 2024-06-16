import React from 'react';
import userEvents from '@testing-library/user-event';
import { SkipNavContent, SkipNavLink } from '../SkipNav';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SkipNav />', () => {
  it('<SkipNavLink /> should render correctly', () => {
    const { getByRole } = renderWithTheme(<SkipNavLink />);

    expect(getByRole('link')).toHaveTextContent('Skip to content');
  });

  it('<SkipNavLink /> should render correctly with children', () => {
    const { getByRole } = renderWithTheme(<SkipNavLink>Skip</SkipNavLink>);

    expect(getByRole('link')).toHaveTextContent('Skip');
  });

  it('<SkipNavContent /> should render correctly', () => {
    const { getByTestId } = renderWithTheme(<SkipNavContent />);

    expect(getByTestId('skipnav-content')).toHaveAttribute('tabindex', '-1');
  });

  it('should skip to main navigation', async () => {
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

  it('should correctly work with two skip navs', async () => {
    const user = userEvents.setup();
    const link1 = 'SkipNav 1';
    const link2 = 'SkipNav 2';
    const { getByRole } = renderWithTheme(
      <div>
        <nav>
          <SkipNavLink>{link1}</SkipNavLink>
          <SkipNavLink id="second-skipnav">{link2}</SkipNavLink>
          <button>one</button>
          <button>two</button>
        </nav>
        <main>
          <SkipNavContent />
          <button>main content</button>
          <SkipNavContent id="second-skipnav" />
          <button>main content</button>
        </main>
      </div>,
    );

    await user.tab();
    expect(getByRole('link', { name: link1 })).toHaveFocus();

    await user.tab();
    expect(getByRole('link', { name: link2 })).toHaveFocus();

    await user.tab();
    expect(getByRole('button', { name: 'one' })).toHaveFocus();

    await user.click(getByRole('link', { name: link1 }));
    expect(window.location.hash).toBe('#blade-skip-nav');

    await user.click(getByRole('link', { name: link2 }));
    expect(window.location.hash).toBe('#second-skipnav');
  });
});
