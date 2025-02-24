import type { TooltipProps } from '~components/Tooltip';
import { Tooltip } from '~components/Tooltip';

type TooltipifyComponentProps = {
  children: React.ReactElement;
  tooltip?: Pick<TooltipProps, 'title' | 'content' | 'onOpenChange'>;
};

/**
 * Utility to support tooltip as a prop
 *
 * Example Usage:
 *
 * ```jsx
 * const SideNavLink = ({ tooltip }) => {
 *   return (
 *    <TooltipifyComponent tooltip={tooltip}>
 *     <button>Click me</button>
 *    </TooltipifyComponent>
 *   )
 *
 * }
 * ```
 *
 * This adds a tooltip to the button when `tooltip` prop is passed. Otherwise renders the children as is
 */
const TooltipifyComponent = ({
  children,
  tooltip,
}: TooltipifyComponentProps): React.ReactElement => {
  if (!tooltip) {
    return children;
  }

  return (
    <Tooltip {...tooltip} placement="top">
      {children}
    </Tooltip>
  );
};

export { TooltipifyComponent };
export type { TooltipifyComponentProps };
