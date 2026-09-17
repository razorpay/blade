import { getContext, setContext } from 'svelte';

const TABS_CONTEXT_KEY = 'blade-tabs-context';

export type TabsContextState = {
  baseId: string;
  selectedValue: string;
  setSelectedValue: (value: string, skipOnChange?: boolean) => void;
  registerTabItem: (value: string) => void;
  focusedValue: string | null;
  setFocusedValue: (value: string | null) => void;
  isVertical: boolean;
  size: 'small' | 'medium' | 'large';
  variant: 'bordered' | 'borderless' | 'filled';
  isFullWidthTabItem: boolean;
  isLazy: boolean;
};

export function setTabsContext(getCtx: () => TabsContextState): void {
  setContext(TABS_CONTEXT_KEY, getCtx);
}

export function getTabsContext(): () => TabsContextState {
  return getContext<() => TabsContextState>(TABS_CONTEXT_KEY);
}
