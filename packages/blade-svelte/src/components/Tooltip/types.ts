import type { Snippet } from 'svelte';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';

/**
 * 8 supported tooltip placements (mirrors React's
 * `Exclude<Placement, 'left-end' | 'left-start' | 'right-end' | 'right-start'>`).
 */
export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left';

type TooltipBaseProps = {
  /**
   * Bold heading rendered above the tooltip content. Optional.
   */
  title?: string;

  /**
   * Body text for the tooltip. Required. Also exposed as `aria-describedby`
   * for the trigger element.
   */
  content: string;

  /**
   * Where the tooltip is positioned relative to the trigger. Floating UI may
   * flip the placement to keep the bubble in view.
   * @default 'top'
   */
  placement?: TooltipPlacement;

  /**
   * Snippet wrapping the trigger element. Required. The trigger is wrapped in
   * a `<span>` that owns hover/focus handlers and the floating-ui reference.
   */
  children: Snippet;

  /**
   * Fired whenever the tooltip's open state toggles.
   */
  onOpenChange?: (event: { isOpen: boolean }) => void;

  /**
   * z-index applied to the portal element that hosts the tooltip bubble.
   * @default 1100
   */
  zIndex?: number;

  /** Test ID for the element. */
  testID?: string;
} & StyledPropsBlade;

export type TooltipProps = TooltipBaseProps & DataAnalyticsAttribute;

type TooltipInteractiveWrapperBaseProps = {
  /** Snippet rendered inside the wrapper. */
  children: Snippet;
  /** Test ID for the element. */
  testID?: string;
} & StyledPropsBlade;

export type TooltipInteractiveWrapperProps = TooltipInteractiveWrapperBaseProps &
  DataAnalyticsAttribute;
