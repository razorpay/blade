import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet } from 'svelte';
import { fireEvent, render } from '@testing-library/svelte';
import Card from '../components/card/Card.svelte';
import CardHeaderHarness from './fixtures/CardHeaderHarness.svelte';
import { expectClass, expectNoClass } from './classes';

const children = createRawSnippet(() => ({
  render: () => '<span>HDFC Bank</span>',
}));
const surfaceOf = (card: HTMLElement): HTMLElement => card.firstElementChild as HTMLElement;

describe('Card', () => {
  it('is a plain box, a named group when labelled', () => {
    const { getByTestId, rerender } = render(Card, {
      props: { children, testID: 'card', class: 'mt-2' },
    });
    const card = getByTestId('card');
    expect(card.tagName).toBe('DIV');
    expect(card.hasAttribute('role')).toBe(false);
    expect(card.className.endsWith('mt-2')).toBe(true);
    return rerender({
      children,
      testID: 'card',
      accessibilityLabel: 'Banks',
    }).then(() => {
      expect(card.getAttribute('role')).toBe('group');
      expect(card.getAttribute('aria-label')).toBe('Banks');
    });
  });

  it('with onClick an overlay button covers the card; controls inside sit above it', async () => {
    const onClick = vi.fn();
    const { getByRole, getByTestId } = render(Card, {
      props: { children, onClick, accessibilityLabel: 'Pay with HDFC', testID: 'card' },
    });
    const overlay = getByRole('button', { name: 'Pay with HDFC' });
    expect(overlay.getAttribute('type')).toBe('button');
    expect(overlay.getAttribute('aria-pressed')).toBe('false');
    expectClass(overlay, 'before:absolute');
    expectClass(overlay, 'focus-visible:before:shadow-focus');
    // The card is not itself a button: it may hold controls of its own.
    expect(getByTestId('card').tagName).toBe('DIV');
    expectClass(overlay.nextElementSibling as HTMLElement, '[&_button]:z-5');
    await fireEvent.click(overlay);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('with href the overlay is a link; _blank gets Blade’s rel', () => {
    const { getByRole } = render(Card, {
      props: { children, href: '/bank', target: '_blank', accessibilityLabel: 'HDFC' },
    });
    const link = getByRole('link', { name: 'HDFC' });
    expect(link.getAttribute('href')).toBe('/bank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('a disabled card has no overlay and is aria-disabled', () => {
    const onClick = vi.fn();
    const { queryByRole, getByTestId } = render(Card, {
      props: { children, onClick, isDisabled: true, isSelected: true, testID: 'card' },
    });
    expect(queryByRole('button')).toBeNull();
    const card = getByTestId('card');
    expect(card.getAttribute('aria-disabled')).toBe('true');
    // Disabled beats selected.
    expectNoClass(card, 'outline-surface-primary-normal');
  });

  it('selected: Blade’s 2px primary ring, and the surface drops its rim', () => {
    const { getByTestId } = render(Card, {
      props: { children, isSelected: true, testID: 'card' },
    });
    const card = getByTestId('card');
    expectClass(card, 'outline-thicker');
    expectClass(card, 'outline-surface-primary-normal');
    expectClass(surfaceOf(card), 'surface-raised-borderless');
  });

  it('as label: the card is a <label>', () => {
    const { getByTestId } = render(Card, {
      props: { children, as: 'label', testID: 'card' },
    });
    expect(getByTestId('card').tagName).toBe('LABEL');
  });

  it('primary is Blade’s raised surface, 24px in by default; 16px is the other step', () => {
    const primary = render(Card, { props: { children, testID: 'a' } }).getByTestId('a');
    expectClass(surfaceOf(primary), 'surface-raised');
    expectClass(surfaceOf(primary), 'bg-surface-gray-intense');
    expectClass(surfaceOf(primary), 'rounded-medium');
    expectClass(surfaceOf(primary), 'p-6');
    primary.remove();
    const tight = render(Card, {
      props: { children, padding: 'spacing.5', variant: 'secondary', testID: 'b' },
    }).getByTestId('b');
    expectClass(surfaceOf(tight), 'p-4');
    expectClass(surfaceOf(tight), 'bg-surface-gray-moderate');
    expect(surfaceOf(tight).className).not.toContain('surface-raised');
  });

  it.each([
    ['spacing.0', 'p-0'],
    ['spacing.3', 'p-2'],
    ['spacing.4', 'p-3'],
  ] as const)("takes Blade React's padding %s", (padding, cls) => {
    const card = render(Card, { props: { children, padding, testID: 'c' } }).getByTestId('c');
    expectClass(surfaceOf(card), cls);
  });

  it('CardHeader and CardFooter sit on hairlines, 12px either side; CardBody between', () => {
    const { getByTestId } = render(CardHeaderHarness);
    const head = getByTestId('head');
    const foot = getByTestId('foot');
    expectClass(head, 'border-b-thin');
    expectClass(head, 'pb-3');
    expectClass(head, 'mb-3');
    expectClass(foot, 'border-t-thin');
    expectClass(foot, 'pt-3');
    expect(getByTestId('card').textContent).toMatch(/Order summary\s*2 items\s*HDFC Bank\s*Total/);
  });

  it('CardHeader draws the title over the subtitle, Blade’s CardHeaderLeading type', () => {
    const { getByText } = render(CardHeaderHarness);
    const title = getByText('Order summary');
    const subtitle = getByText('2 items');
    expect(title.parentElement).toBe(subtitle.parentElement);
    expectClass(title.parentElement, 'flex-col');
    expectClass(title, 'font-semibold');
    expectClass(title, 'text-200');
    expectClass(subtitle, 'text-75');
    expectClass(subtitle, 'text-surface-gray-subtle');
  });

  it('a CardHeader’s title names the card, unless accessibilityLabel does', () => {
    const group = render(CardHeaderHarness);
    expect(group.getByRole('group', { name: 'Order summary' })).toBeTruthy();
    group.unmount();
    const pressable = render(CardHeaderHarness, { props: { onClick: () => undefined } });
    expect(pressable.getByRole('button', { name: 'Order summary' })).toBeTruthy();
    pressable.unmount();
    const labelled = render(CardHeaderHarness, { props: { accessibilityLabel: 'Summary' } });
    expect(labelled.getByRole('group', { name: 'Summary' }).hasAttribute('aria-labelledby')).toBe(
      false,
    );
  });

  it('prefix, suffix and trailing take their places in the row', () => {
    const { getByTestId, getByText } = render(CardHeaderHarness, { props: { withSlots: true } });
    const row = getByTestId('head').firstElementChild!;
    expect(getByTestId('prefix').parentElement?.parentElement).toBe(row);
    expect(getByTestId('trailing').parentElement?.parentElement).toBe(row);
    // The suffix sits beside the title.
    expect(getByTestId('suffix').parentElement?.parentElement).toBe(
      getByText('Order summary').parentElement,
    );
  });

  it('a snippet title sits in the title box', () => {
    const { getByTestId } = render(CardHeaderHarness, { props: { titleSnippet: true } });
    expectClass(getByTestId('t').parentElement, 'font-semibold');
  });

  it("CardFooter draws CardFooterLeading's text and CardFooterTrailing's actions", async () => {
    const onPrimary = vi.fn();
    const { getByRole, getByText } = render(CardHeaderHarness, {
      props: { withActions: true, onPrimary },
    });
    expect(getByText('Total')).toBeTruthy();
    expect(getByText('Incl. taxes')).toBeTruthy();
    const later = getByRole('button', { name: 'Later' });
    const pay = getByRole('button', { name: 'Pay' });
    // Secondary, then primary.
    // eslint-disable-next-line no-bitwise -- compareDocumentPosition returns a bit mask
    expect(later.compareDocumentPosition(pay) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await fireEvent.click(pay);
    expect(onPrimary).toHaveBeenCalledTimes(1);
  });

  it('passes data-analytics-* to the root, and its parts to theirs', () => {
    const { getByTestId } = render(CardHeaderHarness, { props: { withAnalytics: true } });
    expect(getByTestId('card').dataset.analyticsCard).toBe('summary');
    expect(getByTestId('head').dataset.analyticsPart).toBe('header');
    expect(getByTestId('body').dataset.analyticsPart).toBe('body');
    expect(getByTestId('foot').dataset.analyticsPart).toBe('footer');
  });

  it('CardHeader keeps a suffix that has no title', () => {
    const { getByTestId } = render(CardHeaderHarness, {
      props: { title: '', withSlots: true },
    });
    expect(getByTestId('suffix')).toBeTruthy();
  });
});
