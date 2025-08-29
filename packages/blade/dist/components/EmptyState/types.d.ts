import { EmptyStateSize } from './emptyStateTokens';
import { StyledPropsBlade } from '../Box/styledProps';
import { TestID, DataAnalyticsAttribute } from '../../utils/types';
export type EmptyStateProps = {
    /**
     * Asset slot for custom illustrations, images, or any visual element.
     * Supports PNGs, custom brand illustrations, SVGs, animated gifs, lottie components etc.
     *
     * @example
     * ```jsx
     * // Custom image
     * <EmptyState asset={<img src="/custom-illustration.png" alt="No data" />} />
     *
     * // Custom component
     * <EmptyState asset={<CustomIllustration />} />
     * ```
     */
    asset?: React.ReactNode;
    /**
     * Primary heading text for the empty state
     */
    title?: string;
    /**
     * Supporting description text providing context and guidance
     */
    description?: string;
    /**
     * Children content for actions, links, or any custom content.
     */
    children?: React.ReactNode;
    /**
     * Size variant affecting the overall scale of the component
     * @default medium
     */
    size?: EmptyStateSize;
} & TestID & StyledPropsBlade & DataAnalyticsAttribute;
