<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { provideTabs } from '../../runes/tabs/context';
  import { createTabs } from '../../runes/tabs/tabs.svelte';
  import { resolveTabs, type TabsClasses, type TabsStyleProps } from './styles';

  type Props = TabsStyleProps & Partial<AnalyticsAttributes> & {
    /** The picked tab's value; the first enabled tab when unset. */
    value?: string;
    onChange?: (value: string) => void;
    /**
     * `manual`: arrows move focus, a press (or Enter, Space) picks, as
     * Blade; `automatic`: moving focus onto a tab picks it.
     * @default 'manual'
     */
    activation?: 'automatic' | 'manual';
    /** Panels mount only while their tab is picked. @default false */
    isLazy?: boolean;
    /** Names the tablist. */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
    /** The TabItems, as Blade's TabList. */
    tabList: Snippet;
    /** The TabPanels, and anything else under or beside the tabs. */
    children?: Snippet;
  };

  let {
    value = $bindable(),
    onChange,
    activation = 'manual',
    isLazy = false,
    accessibilityLabel,
    testID,
    class: className = '',
    tabList,
    children,
    ...rest
  }: Props = $props();

  const style = useComponentDefaults('Tabs', () => rest);
  const analytics = $derived(analyticsAttributes(rest));

  const uid = $props.id();
  const classes = $derived(resolveTabs(style.current));

  const group = createTabs<TabsClasses>({
    id: uid,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) => onChange?.(next),
    activation: () => activation,
    isLazy: () => isLazy,
    shared: () => classes,
  });
  provideTabs(group);
  const indicator = $derived(group.indicator);
</script>

<div class={cx(classes.root, className)} data-testid={testID} {...analytics}>
  <div class={classes.listBox} {@attach group.attachList}>
    <div
      role="tablist"
      class={classes.list}
      aria-label={accessibilityLabel}
      aria-orientation={style.current.orientation === 'vertical' ? 'vertical' : undefined}
    >
      {@render tabList()}
    </div>
    {#if classes.indicator && indicator}
      <span
        class={classes.indicator}
        style:--tab-x="{indicator.x}px"
        style:--tab-y="{indicator.y}px"
        style:--tab-w="{indicator.width}px"
        style:--tab-h="{indicator.height}px"
        aria-hidden="true"
      ></span>
    {/if}
  </div>
  {@render children?.()}
</div>
