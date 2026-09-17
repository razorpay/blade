import { getContext, setContext } from 'svelte';
import type { SegmentedControlContextType } from './types';

const SEGMENTED_CONTROL_CONTEXT_KEY = 'blade-segmented-control-context';

export function setSegmentedControlContext(getCtx: () => SegmentedControlContextType): void {
  setContext(SEGMENTED_CONTROL_CONTEXT_KEY, getCtx);
}

export function getSegmentedControlContext(): () => SegmentedControlContextType {
  return getContext<() => SegmentedControlContextType>(SEGMENTED_CONTROL_CONTEXT_KEY);
}
