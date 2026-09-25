import { describe, expect, it } from 'vitest';
import { getStyledProps } from './getStyledProps';

describe('getStyledProps', () => {
  it('builds component-scoped CSS custom properties', () => {
    const { modalStyles } = getStyledProps('modal', { width: '12px' });
    expect(modalStyles).toBe('--modal-width: 12px');
  });

  it('returns a key derived from the component name', () => {
    const { collapsibleBodyStyles } = getStyledProps('collapsibleBody', { width: '100%' });
    expect(collapsibleBodyStyles).toBe('--collapsible-body-width: 100%');
  });

  it('converts camelCase props to kebab-case variables', () => {
    const { inputRowStyles } = getStyledProps('inputRow', {
      gridTemplateColumns: '1fr 2fr',
    });
    expect(inputRowStyles).toBe('--input-row-grid-template-columns: 1fr 2fr');
  });

  it('joins multiple declarations with "; "', () => {
    const { chipStyles } = getStyledProps('chip', {
      width: '120px',
      maxWidth: '240px',
      minWidth: '40px',
    });
    expect(chipStyles).toBe('--chip-width: 120px; --chip-max-width: 240px; --chip-min-width: 40px');
  });

  it('supports numeric values', () => {
    const { toastStyles } = getStyledProps('toast', { zIndex: 40, scale: 0.9 });
    expect(toastStyles).toBe('--toast-z-index: 40; --toast-scale: 0.9');
  });

  it('skips undefined, null and empty-string values', () => {
    const { chipStyles } = getStyledProps('chip', {
      width: undefined,
      maxWidth: null,
      minWidth: '',
    });
    expect(chipStyles).toBeUndefined();
  });

  it('returns undefined so the style attribute is omitted when nothing is set', () => {
    const { modalStyles } = getStyledProps('modal', {});
    expect(modalStyles).toBeUndefined();
  });

  describe('margin shorthand expansion', () => {
    it('expands a single value to all four longhands', () => {
      const { checkboxStyles } = getStyledProps('checkbox', { margin: '4px' });
      expect(checkboxStyles).toBe(
        '--checkbox-margin-top: 4px; --checkbox-margin-right: 4px; --checkbox-margin-bottom: 4px; --checkbox-margin-left: 4px',
      );
    });

    it('expands two values (vertical horizontal)', () => {
      const { checkboxStyles } = getStyledProps('checkbox', { margin: '4px 8px' });
      expect(checkboxStyles).toBe(
        '--checkbox-margin-top: 4px; --checkbox-margin-right: 8px; --checkbox-margin-bottom: 4px; --checkbox-margin-left: 8px',
      );
    });

    it('expands three values (top horizontal bottom)', () => {
      const { checkboxStyles } = getStyledProps('checkbox', { margin: '1px 2px 3px' });
      expect(checkboxStyles).toBe(
        '--checkbox-margin-top: 1px; --checkbox-margin-right: 2px; --checkbox-margin-bottom: 3px; --checkbox-margin-left: 2px',
      );
    });

    it('expands four values (top right bottom left)', () => {
      const { checkboxStyles } = getStyledProps('checkbox', { margin: '1px 2px 3px 4px' });
      expect(checkboxStyles).toBe(
        '--checkbox-margin-top: 1px; --checkbox-margin-right: 2px; --checkbox-margin-bottom: 3px; --checkbox-margin-left: 4px',
      );
    });

    it('ignores a margin value with more than four parts', () => {
      const { checkboxStyles } = getStyledProps('checkbox', { margin: '1px 2px 3px 4px 5px' });
      expect(checkboxStyles).toBeUndefined();
    });

    it('mixes expanded margin with other props', () => {
      const { actionListStyles } = getStyledProps('actionList', {
        margin: '8px',
        zIndex: 10,
      });
      expect(actionListStyles).toBe(
        '--action-list-margin-top: 8px; --action-list-margin-right: 8px; --action-list-margin-bottom: 8px; --action-list-margin-left: 8px; --action-list-z-index: 10',
      );
    });
  });

  it('passes through var() values untouched', () => {
    const { skeletonStyles } = getStyledProps('skeleton', {
      width: 'var(--spacing-5)',
    });
    expect(skeletonStyles).toBe('--skeleton-width: var(--spacing-5)');
  });
});
