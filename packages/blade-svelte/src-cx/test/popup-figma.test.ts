/**
 * Menu, Dropdown and ActionList against Blade DSL (Figma): Menu and _Menu
 * Item for Menu; Dropdown, _Action List and _Action List Item for Dropdown
 * and ActionList. One row; two panels; Figma's tokens.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createGenerator } from 'unocss';
import { bladeUnoConfig } from '../../uno.config';
import MenuDivider from '../components/menu/MenuDivider.svelte';
import MenuItem from '../components/menu/MenuItem.svelte';
import { resolveMenu } from '../components/menu/styles';
import { resolveDropdown } from '../components/dropdown/styles';
import { POPUP_SELECTED } from '../components/shared/popup-list';
import { InfoIcon } from '../icons';
import { expectClass, expectNoClass } from './classes';

describe('panels', () => {
  it("Menu's is 12px round, its rows 2px apart; Dropdown's 16px round, its rows touching", () => {
    const menu = resolveMenu({});
    expect(menu.panel).toContain('rounded-medium');
    expect(menu.panel).toContain('gap-0.5 p-2');
    const dropdown = resolveDropdown({});
    expect(dropdown.panel).toContain('rounded-large');
    expect(dropdown.list).toContain('p-2');
    expect(dropdown.list).not.toContain('gap-');
  });

  it("Dropdown's header and footer: 16px in, Figma's divider between them and the rows", () => {
    const { header, footer } = resolveDropdown({});
    expect(header.root).toContain('gap-4 p-4 border-b-thin');
    expect(header.root).toContain('border-surface-gray-muted');
    expect(footer).toContain('gap-4 p-4 border-t-thin');
  });
});

describe('rows', () => {
  it("the keys' row takes Figma's 4px interactive.border.primary.faded ring", () => {
    const { itemState } = resolveMenu({});
    expect(itemState.enabled).toContain('data-[active=keyboard]:outline-4');
    expect(itemState.enabled).toContain('data-[active=keyboard]:outline-interactive-primary-faded');
  });

  it("a glyph and a description take Figma's interactive tokens", () => {
    const { getByRole, getByText } = render(MenuItem, {
      props: { title: 'Card details', description: 'Visa ending 4242', leading: InfoIcon },
    });
    expectClass(getByText('Visa ending 4242'), 'text-interactive-gray-muted');
    expectClass(getByRole('menuitem').firstElementChild, 'icon-interactive-gray-normal');
  });

  it('a negative glyph is feedback.icon.negative.intense', () => {
    const { getByRole } = render(MenuItem, {
      props: { title: 'Remove', intent: 'negative', leading: InfoIcon },
    });
    expectClass(getByRole('menuitem').firstElementChild, 'icon-feedback-negative-intense');
  });

  it('a disabled row draws its title, description and glyph in the …disabled tokens', () => {
    const { getByRole, getByText } = render(MenuItem, {
      props: {
        title: 'Card details',
        description: 'Visa ending 4242',
        leading: InfoIcon,
        isDisabled: true,
      },
    });
    const row = getByRole('menuitem');
    expectClass(row.firstElementChild, 'icon-interactive-gray-disabled');
    expectClass(getByText('Card details').parentElement, 'text-interactive-gray-disabled');
    expectClass(getByText('Visa ending 4242'), 'text-interactive-gray-disabled');
    expectNoClass(getByText('Visa ending 4242'), 'text-interactive-gray-muted');
  });

  it("a picked row keeps Figma's wash under the pointer and the keys", async () => {
    const { itemIntent } = resolveMenu({});
    const uno = await createGenerator(bladeUnoConfig());
    const { css } = await uno.generate(new Set(`${itemIntent.none} ${POPUP_SELECTED}`.split(' ')), {
      preflights: false,
    });
    const hover = css.indexOf('.data-\\[active\\]\\:bg-interactive-gray-default');
    const kept = css.indexOf('.data-\\[active\\]\\:bg-interactive-gray-faded-highlighted');
    expect(hover).toBeGreaterThan(-1);
    // Same specificity: the later rule wins.
    expect(kept).toBeGreaterThan(hover);
  });
});

describe('MenuDivider', () => {
  it("is Figma's separator row: a hairline 1px in from the panel's edges, 4px tall", () => {
    const { getByRole } = render(MenuDivider);
    const divider = getByRole('separator');
    expectClass(divider, '-mx-[7px] my-[1.5px] h-0 border-t-thin');
    expectClass(divider, 'border-surface-gray-muted');
  });
});
