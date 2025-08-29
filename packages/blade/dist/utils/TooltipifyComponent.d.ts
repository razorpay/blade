import { TooltipProps } from '../components/Tooltip';
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
declare const TooltipifyComponent: ({ children, tooltip, }: TooltipifyComponentProps) => React.ReactElement;
export { TooltipifyComponent };
export type { TooltipifyComponentProps };
