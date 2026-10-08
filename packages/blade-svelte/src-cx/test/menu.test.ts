import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import MenuItem from '../components/menu/MenuItem.svelte';
import { resolveMenu } from '../components/menu/styles';
import { InfoIcon } from '../icons';
import { expectClass } from './classes';

const snippet = (html: string) => createRawSnippet(() => ({ render: () => html }));

describe('MenuItem', () => {
  it("is Figma's _Menu Item row: 8px in, Body/Medium, one unbroken line", () => {
    const { item, panel } = resolveMenu({});
    expect(item).toContain('p-2');
    expect(item).not.toContain('d:p-');
    expect(item).toContain('text-100 leading-100 tracking-50');
    expect(item).toContain('whitespace-nowrap');
    // 2px between rows: the panel's gap, not the rows' margins.
    expect(panel).toContain('gap-0.5');
    expect(item).not.toContain('my-');
  });

  it('a leading asset sits in the 20px box; the suffix and trailing item follow the title', () => {
    const { getByRole, getByTestId, getByText } = render(MenuItem, {
      props: {
        title: 'Saved cards',
        leading: snippet('<img data-testid="logo" alt="" />'),
        titleSuffix: snippet('<span data-testid="new">New</span>'),
        trailing: snippet('<span data-testid="shortcut">⌘K</span>'),
      },
    });
    const row = getByRole('menuitem');
    const leading = getByTestId('logo').parentElement!;
    expect(row.firstElementChild).toBe(leading);
    expectClass(leading, 'w-5 h-5');
    const titleRow = getByText('Saved cards').parentElement!;
    expectClass(titleRow, 'gap-2');
    expect(titleRow.contains(getByTestId('new'))).toBe(true);
    expect(row.lastElementChild).toBe(getByTestId('shortcut').parentElement);
    expectClass(row, 'gap-2');
  });

  it('a leading glyph is 16px on the 20px line', () => {
    const { getByRole } = render(MenuItem, { props: { title: 'Help', leading: InfoIcon } });
    const box = getByRole('menuitem').firstElementChild as HTMLElement;
    expectClass(box, 'h-5');
    expectClass(box.firstElementChild as HTMLElement, 'w-4 h-4');
  });
});
