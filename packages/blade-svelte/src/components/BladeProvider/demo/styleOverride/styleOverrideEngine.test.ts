import { describe, expect, it } from 'vitest';
import { BLADE_SLOT_METADATA } from '@razorpay/blade-core/styles';
import {
  STYLE_OVERRIDE_COMPONENTS,
  buildCssSnippet,
  buildDynamicCss,
  buildInstanceSnippet,
  buildProviderSnippet,
  collectCssVarsForComponents,
  collectCssVarsFromClassNames,
  getSlotMeta,
  resolveStyleOverride,
} from './styleOverrideEngine';
import { SIGNATURE_SLOT_CLASSES, getPresetSlotClasses } from './styleOverridePresets';

describe('styleOverride demo engine', () => {
  it('takes its slot catalog from blade-core metadata', () => {
    expect(getSlotMeta('Button').slots.map((slot) => slot.name)).toEqual(['root', 'icon', 'text']);
    expect(STYLE_OVERRIDE_COMPONENTS).toEqual(Object.keys(BLADE_SLOT_METADATA));
  });

  it('seeds a classname for every slot of every component', () => {
    for (const component of STYLE_OVERRIDE_COMPONENTS) {
      const seeded = Object.keys(SIGNATURE_SLOT_CLASSES[component]).sort();
      const documented = getSlotMeta(component)
        .slots.map((slot) => slot.name)
        .sort();
      expect(seeded).toEqual(documented);
    }
  });

  describe('collectCssVarsFromClassNames', () => {
    it('reads the variable out of a utility classname', () => {
      expect(collectCssVarsFromClassNames('text-(--brand-text)')).toEqual(['--brand-text']);
    });

    it('reads the variables a named demo class depends on', () => {
      expect(collectCssVarsFromClassNames('card-brand-border')).toEqual(['--demo-card-border']);
    });

    it('de-duplicates and ignores classnames with no variables', () => {
      expect(collectCssVarsFromClassNames('bg-(--brand-bg) bg-(--brand-bg) cta-pill')).toEqual([
        '--brand-bg',
      ]);
    });
  });

  describe('buildDynamicCss', () => {
    const cssVars = { '--demo-text': '#123456', '--demo-card-border': '#abcdef' };

    it('generates a rule for a typed utility classname', () => {
      const css = buildDynamicCss(
        { AppBarLeading: { title: 'text-(--demo-text)' } },
        ['AppBarLeading'],
        cssVars,
      );
      expect(css).toContain('.text-\\(--demo-text\\) { color: var(--demo-text); }');
    });

    it('leaves classnames that ship their own rule alone', () => {
      const css = buildDynamicCss({ Button: { root: 'bg-(--brand-bg)' } }, ['Button'], cssVars);
      expect(css).not.toContain('background-color: var(--brand-bg)');
    });

    it('pins the variables a named class reads onto that class', () => {
      const css = buildDynamicCss({ Card: { root: 'card-brand-border' } }, ['Card'], cssVars);
      expect(css).toContain('.card-brand-border { --demo-card-border: #abcdef; }');
    });
  });

  describe('snippets', () => {
    const slotClasses = getPresetSlotClasses('signature', ['Button', 'Card']);

    it('drops empty slots', () => {
      expect(resolveStyleOverride({ root: 'brand', icon: '  ', text: '' })).toEqual({
        root: 'brand',
      });
    });

    it('writes an instance snippet with its import', () => {
      const snippet = buildInstanceSnippet('Button', slotClasses.Button);
      expect(snippet).toContain("import { Button } from '@razorpay/blade-svelte';");
      expect(snippet).toContain("root: 'bg-(--brand-bg)',");
    });

    it('omits components that override nothing from the provider snippet', () => {
      const snippet = buildProviderSnippet({ Button: slotClasses.Button, Card: {} }, [
        'Button',
        'Card',
      ]);
      expect(snippet).toContain('Button: {');
      expect(snippet).not.toContain('Card: {');
    });

    it('renders a provider snippet without componentConfig when nothing is set', () => {
      expect(buildProviderSnippet({ Button: {} }, ['Button'])).not.toContain('componentConfig');
    });

    it('emits variables and the rules in play in the CSS snippet', () => {
      const css = buildCssSnippet({ Card: slotClasses.Card }, ['Card'], {
        '--demo-card-border': '#abcdef',
      });
      expect(css).toContain('--demo-card-border: #abcdef;');
      expect(css).toContain('--interactive-border-gray-disabled: var(--demo-card-border);');
      expect(css).not.toContain('--brand-bg');
    });
  });

  it('collects variables across a component subset in first-use order', () => {
    expect(
      collectCssVarsForComponents(getPresetSlotClasses('signature', ['Button']), ['Button']),
    ).toEqual(['--brand-bg', '--brand-color', '--brand-text']);
  });
});
