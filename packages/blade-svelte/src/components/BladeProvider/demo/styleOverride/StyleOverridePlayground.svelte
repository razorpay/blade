<script lang="ts">
  import type {
    AccordionSlot,
    AmountSlot,
    AnnouncementBannerSlot,
    AppBarLeadingSlot,
    AvatarSlot,
    ButtonSlot,
    CardSlot,
    DividerSlot,
    HeadingSlot,
    IconButtonSlot,
    StyleOverride,
    TextSlot,
  } from '@razorpay/blade-core/styles';
  import Accordion from '../../../Accordion/Accordion.svelte';
  import AccordionItem from '../../../Accordion/AccordionItem.svelte';
  import AccordionItemBody from '../../../Accordion/AccordionItemBody.svelte';
  import AccordionItemHeader from '../../../Accordion/AccordionItemHeader.svelte';
  import Amount from '../../../Amount/Amount.svelte';
  import AnnouncementBanner from '../../../AnnouncementBanner/AnnouncementBanner.svelte';
  import AppBar from '../../../AppBar/AppBar.svelte';
  import Avatar from '../../../Avatar/Avatar.svelte';
  import AppBarLeading from '../../../AppBar/AppBarLeading.svelte';
  import AppBarActions from '../../../AppBar/AppBarActions.svelte';
  import Button from '../../../Button/Button.svelte';
  import Card from '../../../Card/Card.svelte';
  import Chip from '../../../Chip/Chip.svelte';
  import ChipGroup from '../../../Chip/ChipGroup.svelte';
  import Divider from '../../../Divider/Divider.svelte';
  import IconButton from '../../../Button/IconButton/IconButton.svelte';
  import TextInput from '../../../Input/TextInput/TextInput.svelte';
  import { InfoIcon, SearchIcon, UserIcon } from '../../../Icons';
  import Code from '../../../Typography/Code/Code.svelte';
  import Heading from '../../../Typography/Heading/Heading.svelte';
  import Text from '../../../Typography/Text/Text.svelte';
  import type { BladeComponentName } from '../../types';

  const COMPONENT_OPTIONS = [
    'Button',
    'IconButton',
    'Text',
    'Heading',
    'Amount',
    'AnnouncementBanner',
    'Card',
    'AppBarLeading',
    'Divider',
    'Avatar',
    'Accordion',
  ] as const satisfies readonly BladeComponentName[];

  type StyleOverrideComponent = (typeof COMPONENT_OPTIONS)[number];

  const SLOT_CATALOG: Record<
    StyleOverrideComponent,
    { slotType: string; slots: readonly string[] }
  > = {
    Button: { slotType: 'ButtonSlot', slots: ['root', 'icon', 'text'] satisfies readonly ButtonSlot[] },
    IconButton: {
      slotType: 'IconButtonSlot',
      slots: ['root', 'icon'] satisfies readonly IconButtonSlot[],
    },
    Text: { slotType: 'TextSlot', slots: ['root'] satisfies readonly TextSlot[] },
    Heading: { slotType: 'HeadingSlot', slots: ['root'] satisfies readonly HeadingSlot[] },
    Amount: { slotType: 'AmountSlot', slots: ['currency', 'value'] satisfies readonly AmountSlot[] },
    AnnouncementBanner: {
      slotType: 'AnnouncementBannerSlot',
      slots: ['root', 'icon', 'text'] satisfies readonly AnnouncementBannerSlot[],
    },
    Card: { slotType: 'CardSlot', slots: ['root'] satisfies readonly CardSlot[] },
    AppBarLeading: {
      slotType: 'AppBarLeadingSlot',
      slots: ['title'] satisfies readonly AppBarLeadingSlot[],
    },
    Divider: { slotType: 'DividerSlot', slots: ['root'] satisfies readonly DividerSlot[] },
    Avatar: {
      slotType: 'AvatarSlot',
      slots: ['root'] satisfies readonly AvatarSlot[],
    },
    Accordion: {
      slotType: 'AccordionSlot',
      slots: [
        'root',
        'item',
        'headerButton',
        'body',
        'title',
        'subtitle',
      ] satisfies readonly AccordionSlot[],
    },
  };

  const DEFAULT_SLOT_CLASSES: Record<StyleOverrideComponent, Record<string, string>> = {
    Button: {
      root: 'bg-(--brand-bg)',
      text: 'text-(--brand-text)',
      icon: 'text-(--brand-color)',
    },
    IconButton: { root: 'icon-btn-radius', icon: 'icon-btn-icon-size' },
    Text: { root: 'text-(--demo-text)' },
    Heading: { root: 'text-(--demo-text)' },
    Amount: {
      value: 'text-(--footer-amount-value)',
      currency: 'text-(--footer-amount-currency)',
    },
    AnnouncementBanner: {
      root: 'bg-(--demo-surface)',
      icon: 'text-(--demo-accent)',
      text: 'announcement-banner-text',
    },
    Card: { root: 'card-brand-border' },
    AppBarLeading: { title: 'text-(--demo-text)' },
    Divider: { root: 'demo-divider' },
    Avatar: {
      root: 'avatar-custom-radius',
    },
    Accordion: {
      root: 'bg-(--demo-accordion-root-bg)',
      item: 'bg-(--demo-accordion-item-bg)',
      headerButton: 'bg-(--demo-accordion-header-bg)',
      title: 'text-(--demo-accordion-title)',
      subtitle: 'text-(--demo-accordion-subtitle)',
      body: 'text-(--demo-accordion-body)',
    },
  };

  function isStyleOverrideComponent(value: string): value is StyleOverrideComponent {
    return (COMPONENT_OPTIONS as readonly string[]).includes(value);
  }

  function createInitialSlotClasses(): Record<StyleOverrideComponent, Record<string, string>> {
    return Object.fromEntries(
      COMPONENT_OPTIONS.map((name) => [name, { ...DEFAULT_SLOT_CLASSES[name] }]),
    ) as Record<StyleOverrideComponent, Record<string, string>>;
  }

  const SLOT_CLASS_TO_CSS_VARS: Record<string, readonly string[]> = {
    'demo-divider': ['--demo-accent'],
    'demo-appbar-actions': ['--demo-accent'],
    'announcement-banner-text': [],
    'card-brand-border': ['--demo-card-border'],
    'avatar-custom-radius': ['--avatar-radius'],
    'icon-btn-radius': ['--icon-btn-radius'],
    'icon-btn-icon-size': ['--icon-btn-icon-size'],
  };

  const LENGTH_CSS_VARS = new Set(['--avatar-radius', '--icon-btn-radius', '--icon-btn-icon-size']);

  const UTILITY_PROPERTY_BY_PREFIX: Record<string, string> = {
    bg: 'background-color',
    text: 'color',
  };

  /** Token-level utilities with non-generic declarations (keep in static component styles). */
  const STATIC_UTILITY_CLASS_TOKENS = new Set(['bg-(--brand-bg)']);

  const INITIAL_CSS_VAR_VALUES: Record<string, string> = {
    '--brand-bg': '#e6c85b',
    '--brand-text': '#FFFFFF',
    '--brand-color': '#FFFFFF',
    '--brand-icon': '#6c5ce7',
    '--footer-amount-value': '#1a1a1a',
    '--footer-amount-currency': '#888888',
    '--demo-text': '#1a1a1a',
    '--demo-accent': '#6c5ce7',
    '--demo-muted': '#888888',
    '--demo-surface': '#f3efff',
    '--demo-accordion-root-bg': '#f3efff',
    '--demo-accordion-item-bg': '#f8f5ff',
    '--demo-accordion-header-bg': '#efe9ff',
    '--demo-accordion-title': '#6c5ce7',
    '--demo-accordion-subtitle': '#888888',
    '--demo-accordion-body': '#1a1a1a',
    '--demo-appbar-bg': '#3669ff',
    '--demo-card-border': '#6c5ce7',
    '--avatar-radius': '6px',
    '--icon-btn-radius': '6px',
    '--icon-btn-icon-size': '20px',
  };

  const CSS_VAR_IN_UTILITY = /\(--([\w-]+)\)/g;
  const UTILITY_CLASS_PATTERN = /^([a-z]+)-\(--([\w-]+)\)$/;

  type ParsedUtilityClass = {
    classToken: string;
    cssVar: string;
    property: string;
  };

  function parseUtilityClassToken(token: string): ParsedUtilityClass | null {
    const match = UTILITY_CLASS_PATTERN.exec(token);
    if (!match) {
      return null;
    }
    const [, prefix, varStem] = match;
    const property = UTILITY_PROPERTY_BY_PREFIX[prefix];
    if (!property) {
      return null;
    }
    return { classToken: token, cssVar: `--${varStem}`, property };
  }

  function escapeUtilityClassSelector(classToken: string): string {
    return classToken.replace(/([()])/g, '\\$1');
  }

  function collectCssVarsFromClassNames(classNames: string): string[] {
    const used = new Set<string>();
    const order: string[] = [];
    const trimmed = classNames.trim();
    if (!trimmed) {
      return [];
    }

    const registerVar = (varName: string): void => {
      if (!used.has(varName)) {
        used.add(varName);
        order.push(varName);
      }
    };

    for (const token of trimmed.split(/\s+/)) {
      const parsedUtility = parseUtilityClassToken(token);
      if (parsedUtility) {
        registerVar(parsedUtility.cssVar);
      } else {
        CSS_VAR_IN_UTILITY.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = CSS_VAR_IN_UTILITY.exec(token)) !== null) {
          registerVar(`--${match[1]}`);
        }
      }

      const mappedVars = SLOT_CLASS_TO_CSS_VARS[token];
      if (mappedVars) {
        for (const varName of mappedVars) {
          registerVar(varName);
        }
      }
    }

    return order;
  }

  function collectUtilityClassesFromClassNames(classNames: string): ParsedUtilityClass[] {
    const seen = new Set<string>();
    const utilities: ParsedUtilityClass[] = [];
    const trimmed = classNames.trim();
    if (!trimmed) {
      return [];
    }

    for (const token of trimmed.split(/\s+/)) {
      const parsed = parseUtilityClassToken(token);
      if (!parsed || seen.has(parsed.classToken) || STATIC_UTILITY_CLASS_TOKENS.has(parsed.classToken)) {
        continue;
      }
      seen.add(parsed.classToken);
      utilities.push(parsed);
    }

    return utilities;
  }

  let selectedComponent = $state<StyleOverrideComponent>('Button');
  let slotClassByComponent = $state(createInitialSlotClasses());

  let cssVarValues = $state<Record<string, string>>({ ...INITIAL_CSS_VAR_VALUES });

  const catalog = $derived(SLOT_CATALOG[selectedComponent]);
  const slotClasses = $derived(slotClassByComponent[selectedComponent]);

  const styleOverride = $derived.by((): StyleOverride<string> => {
    const entries = Object.entries(slotClasses).filter(([, className]) => className.trim());
    return Object.fromEntries(entries);
  });

  const typeSnippet = $derived.by((): string => {
    const union = catalog.slots.map((slot) => `'${slot}'`).join(' | ');
    return `type ${catalog.slotType} = ${union};`;
  });

  const styleOverrideSnippet = $derived.by((): string => {
    const keys = Object.keys(styleOverride);
    if (keys.length === 0) {
      return 'styleOverride={undefined}';
    }
    const props = keys.map((key) => `${key}: '${styleOverride[key]}'`).join(', ');
    return `styleOverride={{ ${props} }}`;
  });

  const activeCssVars = $derived.by((): string[] => {
    const used = new Set<string>();
    const order: string[] = [];
    for (const slot of catalog.slots) {
      for (const varName of collectCssVarsFromClassNames(slotClasses[slot] ?? '')) {
        if (!used.has(varName)) {
          used.add(varName);
          order.push(varName);
        }
      }
    }
    return order;
  });

  const previewVarsStyle = $derived(
    activeCssVars.map((varName) => `${varName}: ${getCssVarValue(varName)}`).join('; '),
  );

  const dynamicUtilityCss = $derived.by((): string => {
    const seen = new Set<string>();
    const rules: string[] = [];

    for (const slot of catalog.slots) {
      for (const utility of collectUtilityClassesFromClassNames(slotClasses[slot] ?? '')) {
        if (seen.has(utility.classToken)) {
          continue;
        }
        seen.add(utility.classToken);
        const selector = `.${escapeUtilityClassSelector(utility.classToken)}`;
        rules.push(`${selector} { ${utility.property}: var(${utility.cssVar}); }`);
      }
    }

    return rules.join('\n');
  });

  const dynamicMappedSlotCss = $derived.by((): string => {
    const seen = new Set<string>();
    const rules: string[] = [];

    for (const slot of catalog.slots) {
      const classNames = (slotClasses[slot] ?? '').trim();
      if (!classNames) {
        continue;
      }

      for (const token of classNames.split(/\s+/)) {
        const mappedVars = SLOT_CLASS_TO_CSS_VARS[token];
        if (!mappedVars?.length || seen.has(token)) {
          continue;
        }
        seen.add(token);
        const declarations = mappedVars
          .map((varName) => `${varName}: ${getCssVarValue(varName)}`)
          .join('; ');
        rules.push(`.${token} { ${declarations}; }`);
      }
    }

    return rules.join('\n');
  });

  function defaultCssVarValue(varName: string): string {
    return INITIAL_CSS_VAR_VALUES[varName] ?? '#888888';
  }

  function getCssVarValue(varName: string): string {
    return cssVarValues[varName] ?? defaultCssVarValue(varName);
  }

  function setCssVarValue(varName: string, value: string): void {
    cssVarValues = { ...cssVarValues, [varName]: value };
  }

  function parseLengthPx(value: string): number {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function setLengthVarValue(varName: string, px: number): void {
    setCssVarValue(varName, `${Math.max(0, px)}px`);
  }

  function ensureCssVarsRegistered(varNames: readonly string[]): void {
    let next: Record<string, string> | null = null;
    for (const varName of varNames) {
      if (varName in cssVarValues) {
        continue;
      }
      if (!next) {
        next = { ...cssVarValues };
      }
      next[varName] = defaultCssVarValue(varName);
    }
    if (next) {
      cssVarValues = next;
    }
  }

  $effect(() => {
    ensureCssVarsRegistered(activeCssVars);
  });

  let utilityStyleHost = $state<HTMLDivElement | undefined>(undefined);

  $effect(() => {
    const host = utilityStyleHost;
    const css = [dynamicUtilityCss, dynamicMappedSlotCss].filter(Boolean).join('\n');
    if (!host) {
      return;
    }

    let styleEl = host.querySelector<HTMLStyleElement>('style[data-style-override-playground-utilities]');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.setAttribute('data-style-override-playground-utilities', '');
      host.appendChild(styleEl);
    }
    styleEl.textContent = css;
  });

  function onComponentChange(payload: { name: string; values: string[] }): void {
    const next = payload.values[0];
    if (next && isStyleOverrideComponent(next)) {
      selectedComponent = next;
    }
  }

  function updateSlotClass(slot: string, value: string): void {
    slotClassByComponent = {
      ...slotClassByComponent,
      [selectedComponent]: {
        ...slotClassByComponent[selectedComponent],
        [slot]: value,
      },
    };
  }

  function resetSlotClasses(): void {
    slotClassByComponent = {
      ...slotClassByComponent,
      [selectedComponent]: { ...DEFAULT_SLOT_CLASSES[selectedComponent] },
    };
  }
</script>

<div bind:this={utilityStyleHost} hidden aria-hidden="true"></div>

<div class="story-shell">
  <div class="playground">
    <Heading size="large" weight="semibold">styleOverride slots</Heading>
    <Text size="medium" color="surface.text.gray.muted">
      Per-component classname overrides merge with
      <Code size="small">BladeProvider</Code>
      <Code size="small">componentConfig[Name].styleOverride</Code>; instance prop wins. Slot unions
      match checkout spec in
      <Code size="small">@razorpay/blade-core/styles</Code>
      (e.g. Card → <Code size="small">surface</Code>, AnnouncementBanner →
      <Code size="small">icon</Code>).
    </Text>

    <div class="control-block">
      <Text size="small" weight="semibold">Component</Text>
      <div class="component-chip-group">
        <ChipGroup
          accessibilityLabel="Style override component"
          selectionType="single"
          size="small"
          value={selectedComponent}
          onChange={onComponentChange}
        >
          {#each COMPONENT_OPTIONS as name (name)}
            <Chip value={name}>{name}</Chip>
          {/each}
        </ChipGroup>
      </div>
    </div>

    <div class="control-block">
      <Text size="small" weight="semibold">Typed slots ({selectedComponent})</Text>
      <pre class="type-snippet"><code>{typeSnippet}</code></pre>
    </div>

    <div class="control-block slot-grid">
      <div class="slot-grid-header">
        <Text size="small" weight="semibold">Slot classnames</Text>
        <Button variant="tertiary" size="small" onClick={resetSlotClasses}>Reset defaults</Button>
      </div>
      {#each catalog.slots as slot (slot)}
        {@const slotClassNames = slotClasses[slot] ?? ''}
        {@const slotCssVars = collectCssVarsFromClassNames(slotClassNames)}
        <div class="slot-field" class:slot-field--no-vars={slotCssVars.length === 0}>
          <span class="slot-label">
            <Text size="small" weight="medium">{slot}</Text>
          </span>
          <div class="slot-input">
            <TextInput
              size="medium"
              accessibilityLabel="{selectedComponent} · {slot} · classname"
              value={slotClassNames}
              placeholder="utility or global class"
              onChange={({ value }) => updateSlotClass(slot, value ?? '')}
            />
          </div>
          {#if slotCssVars.length > 0}
            <div class="slot-var-controls">
              {#each slotCssVars as varName (varName)}
                <label class="slot-var-control">
                  <span class="slot-var-name">{varName}</span>
                  {#if LENGTH_CSS_VARS.has(varName)}
                    <input
                      type="number"
                      class="slot-var-length"
                      min="0"
                      max="48"
                      step="1"
                      value={parseLengthPx(getCssVarValue(varName))}
                      aria-label="{selectedComponent} · {slot} · {varName}"
                      oninput={(event) =>
                        setLengthVarValue(varName, event.currentTarget.valueAsNumber)}
                    />
                  {:else}
                    <input
                      type="color"
                      class="slot-var-swatch"
                      value={getCssVarValue(varName)}
                      aria-label="{selectedComponent} · {slot} · {varName}"
                      oninput={(event) => setCssVarValue(varName, event.currentTarget.value)}
                    />
                  {/if}
                  <span class="slot-var-hex">{getCssVarValue(varName)}</span>
                </label>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <div class="control-block">
      <Text size="small" weight="semibold">Resolved prop</Text>
      <Code size="small" isHighlighted={false}>{styleOverrideSnippet}</Code>
    </div>

    <div class="control-block preview-block" style={previewVarsStyle}>
      <Text size="small" weight="semibold">Preview</Text>
      <div class="preview-variants">
        {#if selectedComponent === 'Button'}
          {#each ['primary', 'secondary', 'tertiary'] as variant (variant)}
            <div class="preview-variant-row">
              <Text size="small" color="surface.text.gray.muted">{variant}</Text>
              <div class="preview-variant-samples">
                <Button
                  variant={variant as 'primary' | 'secondary' | 'tertiary'}
                  styleOverride={styleOverride as StyleOverride<ButtonSlot>}
                >
                  Pay Now
                </Button>
                <Button
                  variant={variant as 'primary' | 'secondary' | 'tertiary'}
                  icon={SearchIcon}
                  styleOverride={styleOverride as StyleOverride<ButtonSlot>}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          {/each}
          <div class="preview-variant-row">
            <Text size="small" color="surface.text.gray.muted">disabled opacity</Text>
            <div class="preview-variant-samples">
              <Button styleOverride={{ root: 'cta-disabled-fade' }}>Pay Now</Button>
              <Button isDisabled styleOverride={{ root: 'cta-disabled-fade' }}>Pay Now</Button>
            </div>
          </div>
        {:else if selectedComponent === 'IconButton'}
          {#each ['moderate', 'intense'] as emphasis (emphasis)}
            <div class="preview-variant-row">
              <Text size="small" color="surface.text.gray.muted">{emphasis}</Text>
              <div class="preview-variant-samples">
                {#each ['small', 'medium', 'large'] as size (size)}
                  <IconButton
                    icon={SearchIcon}
                    emphasis={emphasis as 'moderate' | 'intense'}
                    size={size as 'small' | 'medium' | 'large'}
                    accessibilityLabel="Search {size}"
                    onClick={() => undefined}
                    styleOverride={styleOverride as StyleOverride<IconButtonSlot>}
                  />
                {/each}
              </div>
            </div>
          {/each}
        {:else if selectedComponent === 'Text'}
          {#each ['small', 'medium', 'large'] as size (size)}
            <Text
              variant="body"
              size={size as 'small' | 'medium' | 'large'}
              styleOverride={styleOverride as StyleOverride<TextSlot>}
            >
              Body · {size}
            </Text>
          {/each}
        {:else if selectedComponent === 'Heading'}
          {#each ['small', 'medium', 'large'] as size (size)}
            <Heading
              size={size as 'small' | 'medium' | 'large'}
              styleOverride={styleOverride as StyleOverride<HeadingSlot>}
            >
              Heading · {size}
            </Heading>
          {/each}
        {:else if selectedComponent === 'Amount'}
          {#each ['small', 'medium', 'large'] as size (size)}
            <Amount
              value={1234.56}
              type="body"
              size={size as 'small' | 'medium' | 'large'}
              styleOverride={styleOverride as StyleOverride<AmountSlot>}
            />
          {/each}
        {:else if selectedComponent === 'AnnouncementBanner'}
          {#each [{ alignment: 'center' as const, label: 'center' }, { alignment: 'left' as const, label: 'left' }] as row (row.label)}
            <AnnouncementBanner
              alignment={row.alignment}
              icon={InfoIcon}
              styleOverride={styleOverride as StyleOverride<AnnouncementBannerSlot>}
            >
              {row.label} · promotional text
            </AnnouncementBanner>
          {/each}
          <AnnouncementBanner styleOverride={styleOverride as StyleOverride<AnnouncementBannerSlot>}>
            No icon
          </AnnouncementBanner>
        {:else if selectedComponent === 'Card'}
          {#each ['primary', 'secondary', 'theme'] as variant (variant)}
            <Card
              variant={variant as 'primary' | 'secondary' | 'theme'}
              styleOverride={styleOverride as StyleOverride<CardSlot>}
              width="min(100%, 320px)"
            >
              {#snippet children()}
                <Text size="medium">Card · {variant}</Text>
              {/snippet}
            </Card>
          {/each}
        {:else if selectedComponent === 'AppBarLeading'}
          {#each ['neutral', 'subtle'] as variant (variant)}
            <div class="app-bar-preview-shell">
              <AppBar variant={variant as 'neutral' | 'subtle'} isSticky={false}>
                {#snippet children()}
                  <AppBarLeading
                    title="AppBarLeading · {variant}"
                    styleOverride={styleOverride as StyleOverride<AppBarLeadingSlot>}
                  />
                  <AppBarActions>
                    <IconButton
                      icon={UserIcon}
                      emphasis="moderate"
                      accessibilityLabel="Account"
                      onClick={() => undefined}
                    />
                  </AppBarActions>
                {/snippet}
              </AppBar>
            </div>
          {/each}
        {:else if selectedComponent === 'Divider'}
          {#each ['normal', 'subtle', 'muted'] as variant (variant)}
            <div class="preview-divider-row" style="width: min(100%, 360px);">
              <Text size="small" color="surface.text.gray.muted">{variant}</Text>
              <Divider
                variant={variant as 'normal' | 'subtle' | 'muted'}
                styleOverride={styleOverride as StyleOverride<DividerSlot>}
              />
            </div>
          {/each}
        {:else if selectedComponent === 'Avatar'}
          {#each ['circle', 'square'] as variant (variant)}
            <div class="preview-variant-row">
              <Text size="small" color="surface.text.gray.muted">{variant}</Text>
              <div class="preview-variant-samples">
                {#each ['medium', 'large'] as size (size)}
                  <Avatar
                    name="Maven Shop"
                    variant={variant as 'circle' | 'square'}
                    size={size as 'medium' | 'large'}
                    styleOverride={styleOverride as StyleOverride<AvatarSlot>}
                  />
                {/each}
              </div>
            </div>
          {/each}
        {:else if selectedComponent === 'Accordion'}
          <div class="accordion-preview-shell">
            <Accordion
              variant="transparent"
              defaultExpandedIndex={0}
              styleOverride={styleOverride as StyleOverride<AccordionSlot>}
            >
              {#snippet children()}
                <AccordionItem>
                  {#snippet children()}
                    <AccordionItemHeader
                      title="PhonePe Wallet"
                      subtitle="+ ₹50 Extra Charge"
                    />
                    <AccordionItemBody>
                      Enter phone number to continue with PhonePe Wallet payment.
                    </AccordionItemBody>
                  {/snippet}
                </AccordionItem>
                <AccordionItem>
                  {#snippet children()}
                    <AccordionItemHeader
                      title="HDFC Credit Card"
                      subtitle="No EMI Cost Available"
                    />
                    <AccordionItemBody>
                      Enter card details to pay with HDFC Credit Card.
                    </AccordionItemBody>
                  {/snippet}
                </AccordionItem>
              {/snippet}
            </Accordion>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .story-shell {
    display: flex;
    justify-content: center;
    padding: var(--spacing-8);
    background-color: var(--surface-background-gray-moderate);
  }

  .playground {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-6);
    width: min(100%, 960px);
    box-sizing: border-box;
    padding: var(--spacing-8);
    background-color: var(--surface-background-gray-subtle);
    border-radius: var(--border-radius-large);
    border: 1px solid var(--surface-border-gray-muted);
    box-shadow: var(--elevation-low-raised);
  }

  .control-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
    width: 100%;
  }

  .component-chip-group {
    width: 100%;
  }

  .component-chip-group :global([data-blade-component='chip-group']) {
    flex-wrap: wrap;
  }

  .type-snippet {
    margin: 0;
    width: 100%;
    box-sizing: border-box;
    padding: var(--spacing-4);
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--surface-border-gray-muted);
    background-color: var(--surface-background-gray-intense);
    font-family: var(--font-family-code);
    font-size: var(--font-size-75);
    line-height: 1.5;
    overflow-x: auto;
    white-space: pre-wrap;
  }

  .slot-grid {
    gap: var(--spacing-2);
  }

  .slot-grid-header {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-3);
  }

  .slot-field {
    display: grid;
    grid-template-columns: 5rem 360px minmax(0, 1fr);
    align-items: center;
    column-gap: var(--spacing-3);
    row-gap: var(--spacing-2);
    width: 100%;
    padding: var(--spacing-2) 0;
    border-bottom: 1px solid var(--surface-border-gray-muted);
  }

  .slot-field:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .slot-field--no-vars {
    grid-template-columns: 5rem 360px;
  }

  .slot-label {
    display: block;
    align-self: center;
  }

  .slot-input {
    width: 360px;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .slot-var-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-4);
  }

  .slot-var-control {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-2);
    margin: 0;
    cursor: pointer;
  }

  .slot-var-name {
    font-family: var(--font-family-code);
    font-size: var(--font-size-75);
    line-height: 1;
    color: var(--surface-text-gray-muted);
    white-space: nowrap;
  }

  .slot-var-swatch {
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-small);
    cursor: pointer;
    background: transparent;
    box-sizing: border-box;
    flex-shrink: 0;
    overflow: hidden;
    appearance: none;
  }

  .slot-var-swatch::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  .slot-var-swatch::-webkit-color-swatch {
    border: none;
    border-radius: calc(var(--border-radius-small) - 1px);
  }

  .slot-var-swatch::-moz-color-swatch {
    border: none;
    border-radius: calc(var(--border-radius-small) - 1px);
  }

  .slot-var-length {
    width: 4.5rem;
    height: 2rem;
    padding: 0 var(--spacing-2);
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-small);
    font-family: var(--font-family-code);
    font-size: var(--font-size-75);
    color: var(--surface-text-gray-normal);
    background-color: var(--surface-background-gray-intense);
    box-sizing: border-box;
    flex-shrink: 0;
  }

  .slot-var-hex {
    font-family: var(--font-family-code);
    font-size: var(--font-size-75);
    line-height: 1;
    color: var(--surface-text-gray-normal);
    white-space: nowrap;
  }

  .preview-block {
    padding: var(--spacing-5);
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--surface-border-gray-muted);
  }

  .preview-variants {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-4);
    width: 100%;
  }

  .preview-variant-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
    width: 100%;
  }

  .preview-variant-samples {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-3);
  }

  .preview-divider-row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    width: 100%;
  }

  .app-bar-preview-shell {
    width: min(100%, 375px);
    border-radius: var(--border-radius-medium);
    overflow: hidden;
  }

  .accordion-preview-shell {
    width: min(100%, 480px);
  }

  :global(.bg-\(--brand-bg\)) {
    --interactive-background-primary-default: var(--brand-bg);
    --interactive-background-primary-highlighted: color-mix(in srgb, var(--brand-bg) 80%, black);
    --interactive-background-primary-disabled: color-mix(in srgb, var(--brand-bg) 18%, transparent);
    --interactive-border-primary-default: var(--brand-bg);
    --interactive-border-primary-highlighted: color-mix(in srgb, var(--brand-bg) 80%, black);
    background-image: none;
  }

  :global(.demo-appbar-actions) {
    box-shadow: inset 0 0 0 2px var(--demo-accent);
    border-radius: var(--border-radius-medium);
    padding: var(--spacing-1);
  }

  :global(.demo-divider) {
    background-color: var(--demo-accent);
  }

  :global(.card-brand-border) {
    --interactive-border-gray-disabled: var(--demo-card-border);
  }

  :global(.icon-btn-radius) {
    border-radius: var(--icon-btn-radius);
  }

  :global(.icon-btn-icon-size svg) {
    width: var(--icon-btn-icon-size);
    height: var(--icon-btn-icon-size);
  }

  :global(.announcement-banner-text) {
    font-size: 14px;
    font-weight: 600;
  }

  :global(.cta-disabled-fade[disabled]) {
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    .story-shell {
      padding: var(--spacing-3);
    }

    .playground {
      padding: var(--spacing-5);
    }

    .slot-field {
      grid-template-columns: 1fr;
      align-items: stretch;
    }

    .slot-field--no-vars {
      grid-template-columns: 1fr;
    }

    .slot-input {
      width: 100%;
    }
  }
</style>
