import { DEMO_CSS_VAR_DEFAULTS } from './styleOverrideEngine';
import type { SlotClassMap, StyleOverrideComponent } from './styleOverrideEngine';

/**
 * One-click looks for the `styleOverride` surfaces. A preset is the answer to "show me the
 * ceiling" — evaluators get a styled checkout in one click instead of constructing it from
 * empty text boxes.
 *
 * Presets mostly move variables rather than classnames, because the seeded classes are already
 * variable-driven. `--demo-text` is deliberately absent: whether title text reads dark or light
 * depends on the surface behind it, so each playground seeds that one itself.
 */
export type StyleOverridePreset = {
  id: string;
  label: string;
  /** One line on what the look does, shown next to the picker. */
  description: string;
  /** Slot classes layered over {@link SIGNATURE_SLOT_CLASSES}. */
  slotClasses: Partial<Record<StyleOverrideComponent, SlotClassMap>>;
  /** Variable values layered over `DEMO_CSS_VAR_DEFAULTS`. */
  cssVars: Record<string, string>;
};

/** The classnames every surface starts from, and what `Reset` restores. */
export const SIGNATURE_SLOT_CLASSES: Record<StyleOverrideComponent, SlotClassMap> = {
  Button: {
    root: 'bg-(--brand-bg)',
    icon: 'text-(--brand-icon)',
    text: 'text-(--brand-text)',
  },
  IconButton: { root: 'rounded-(--icon-btn-radius)', icon: 'text-(--icon-btn-icon-color)' },
  Text: { root: 'text-(--demo-text)' },
  Heading: { root: 'text-(--demo-text)' },
  Amount: {
    currency: 'text-(--footer-amount-currency)',
    value: 'text-(--footer-amount-value)',
  },
  AnnouncementBanner: {
    root: 'bg-(--demo-surface)',
    icon: 'text-(--demo-accent)',
    text: 'text-(--demo-text)',
  },
  Card: { root: 'card-brand-border', surface: 'rounded-(--card-radius)' },
  AppBarLeading: { title: 'text-(--demo-text)' },
  Divider: { root: 'bg-(--demo-accent)' },
  Avatar: { root: 'rounded-(--demo-avatar-radius)' },
  Accordion: {
    root: 'bg-(--demo-accordion-root-bg)',
    item: 'bg-(--demo-accordion-item-bg)',
    headerButton: 'bg-(--demo-accordion-header-bg)',
    body: 'text-(--demo-accordion-body)',
    title: 'text-(--demo-accordion-title)',
    subtitle: 'text-(--demo-accordion-subtitle)',
  },
};

export const STYLE_OVERRIDE_PRESETS: readonly StyleOverridePreset[] = [
  {
    id: 'signature',
    label: 'Blade signature',
    description: 'The seeded classnames — ink CTA on Blade surfaces.',
    slotClasses: {},
    cssVars: {},
  },
  {
    id: 'neobank-dark',
    label: 'Neobank dark',
    description: 'Slate CTA, cyan accents, squared corners.',
    slotClasses: { Button: { root: 'bg-(--brand-bg) cta-square' } },
    cssVars: {
      '--brand-bg': '#0f172a',
      '--brand-text': '#f8fafc',
      '--brand-icon': '#38bdf8',
      '--demo-accent': '#38bdf8',
      '--demo-surface': '#e2e8f0',
      '--demo-card-border': '#94a3b8',
      '--card-radius': '4px',
      '--demo-accordion-root-bg': '#f1f5f9',
      '--demo-accordion-item-bg': '#ffffff',
      '--demo-accordion-header-bg': '#f8fafc',
      '--demo-accordion-title': '#0f172a',
      '--demo-accordion-subtitle': '#64748b',
      '--demo-accordion-body': '#334155',
      '--footer-amount-value': '#0f172a',
      '--footer-amount-currency': '#64748b',
      '--demo-avatar-radius': '4px',
      '--icon-btn-radius': '4px',
    },
  },
  {
    id: 'fintech-pill',
    label: 'Fintech pill',
    description: 'Mint brand, fully rounded CTA, soft surfaces.',
    slotClasses: { Button: { root: 'bg-(--brand-bg) cta-pill' } },
    cssVars: {
      '--brand-bg': '#00b386',
      '--brand-text': '#ffffff',
      '--brand-icon': '#ffffff',
      '--demo-accent': '#00b386',
      '--demo-surface': '#e6f7f1',
      '--demo-card-border': '#8fd8c2',
      '--card-radius': '20px',
      '--demo-accordion-root-bg': '#f2fbf8',
      '--demo-accordion-item-bg': '#ffffff',
      '--demo-accordion-header-bg': '#e6f7f1',
      '--demo-accordion-title': '#0b3d33',
      '--demo-accordion-subtitle': '#5b8f81',
      '--demo-accordion-body': '#0b3d33',
      '--footer-amount-value': '#0b3d33',
      '--footer-amount-currency': '#5b8f81',
      '--demo-avatar-radius': '24px',
      '--icon-btn-radius': '24px',
    },
  },
  {
    id: 'enterprise-flat',
    label: 'Enterprise flat',
    description: 'Indigo brand, flat corners, restrained neutrals.',
    slotClasses: { Button: { root: 'bg-(--brand-bg) cta-square' } },
    cssVars: {
      '--brand-bg': '#3730a3',
      '--brand-text': '#ffffff',
      '--brand-icon': '#c7d2fe',
      '--demo-accent': '#3730a3',
      '--demo-surface': '#eef2ff',
      '--demo-card-border': '#c7d2fe',
      '--card-radius': '2px',
      '--demo-accordion-root-bg': '#f5f5f7',
      '--demo-accordion-item-bg': '#ffffff',
      '--demo-accordion-header-bg': '#eef2ff',
      '--demo-accordion-title': '#1f2937',
      '--demo-accordion-subtitle': '#6b7280',
      '--demo-accordion-body': '#374151',
      '--footer-amount-value': '#1f2937',
      '--footer-amount-currency': '#6b7280',
      '--demo-avatar-radius': '2px',
      '--icon-btn-radius': '2px',
    },
  },
];

export const DEFAULT_PRESET_ID = STYLE_OVERRIDE_PRESETS[0].id;

export const getPreset = (presetId: string): StyleOverridePreset =>
  STYLE_OVERRIDE_PRESETS.find((preset) => preset.id === presetId) ?? STYLE_OVERRIDE_PRESETS[0];

/** Slot classes for one surface's component subset, with the preset layered over the signature. */
export const getPresetSlotClasses = <Name extends StyleOverrideComponent>(
  presetId: string,
  components: readonly Name[],
): Record<Name, SlotClassMap> => {
  const preset = getPreset(presetId);
  return Object.fromEntries(
    components.map((name) => [
      name,
      { ...SIGNATURE_SLOT_CLASSES[name], ...preset.slotClasses[name] },
    ]),
  ) as Record<Name, SlotClassMap>;
};

export const getPresetCssVars = (
  presetId: string,
  seedOverrides: Record<string, string> = {},
): Record<string, string> => ({
  ...DEMO_CSS_VAR_DEFAULTS,
  ...getPreset(presetId).cssVars,
  ...seedOverrides,
});
