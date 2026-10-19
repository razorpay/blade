import { beforeEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import RoutedLinksHarness from './fixtures/RoutedLinksHarness.svelte';

const prevented = (): string | undefined => document.body.dataset.prevented;

beforeEach(() => {
  delete document.body.dataset.prevented;
});

// TabItem, Card, Avatar and the intense BreadcrumbItem draw their own
// anchors: each reaches `adapters.navigate` as Link does.
describe('href renderers', () => {
  it.each([
    ['tab', 'Orders', '/orders'],
    ['link', 'HDFC', '/bank'],
    ['link', 'Ann Lee', '/profile'],
    ['link', 'Home', '/home'],
  ] as const)('a %s named %s goes to the router', async (role, name, href) => {
    const navigate = vi.fn(() => true);
    const { getByRole } = render(RoutedLinksHarness, { props: { navigate } });
    await fireEvent.click(getByRole(role, { name }));
    expect(navigate).toHaveBeenCalledWith(href, expect.any(MouseEvent));
    expect(prevented()).toBe('true');
  });

  it.each(['Razorpay', 'Bo Ray'])(
    '%s, a new tab off the app, stays the browser’s',
    async (name) => {
      const navigate = vi.fn(() => true);
      const { getByRole } = render(RoutedLinksHarness, { props: { navigate } });
      await fireEvent.click(getByRole('link', { name }));
      expect(navigate).not.toHaveBeenCalled();
      expect(prevented()).toBe('false');
    },
  );

  it('guards a new tab, keeping the caller rel', () => {
    const { getByRole } = render(RoutedLinksHarness);
    expect(getByRole('link', { name: 'Razorpay' }).getAttribute('rel')).toBe('noopener noreferrer');
    expect(getByRole('link', { name: 'Bo Ray' }).getAttribute('rel')).toBe(
      'nofollow noopener noreferrer',
    );
  });

  it('without a router a click is the browser’s', async () => {
    const { getByRole } = render(RoutedLinksHarness);
    await fireEvent.click(getByRole('tab', { name: 'Orders' }));
    expect(prevented()).toBe('false');
  });
});
