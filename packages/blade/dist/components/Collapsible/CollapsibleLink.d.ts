import { ReactElement } from 'react';
import { LinkProps } from '../Link';
import { StyledPropsBlade } from '../Box/styledProps';
import { DataAnalyticsAttribute } from '../../utils/types';
type CollapsibleLinkProps = Pick<LinkProps, 'color' | 'size' | 'isDisabled' | 'testID' | 'accessibilityLabel' | 'children'> & DataAnalyticsAttribute & StyledPropsBlade;
declare const CollapsibleLink: ({ children, size, color, isDisabled, testID, accessibilityLabel, ...rest }: CollapsibleLinkProps) => ReactElement;
export type { CollapsibleLinkProps };
export { CollapsibleLink };
