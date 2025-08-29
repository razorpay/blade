import { default as React } from 'react';
import { StringChildrenType, TestID } from '../../utils/types';
type SkipNavLinkProps = {
    id?: string;
    children?: StringChildrenType;
    /**
     * **Internal**
     *
     * Adds background to link. Used internally in SideNav
     */
    _hasBackground?: boolean;
};
declare const SkipNavLink: ({ id, children, _hasBackground, }: SkipNavLinkProps) => React.ReactElement;
type SkipNavContentProps = {
    id?: string;
} & TestID;
declare const SkipNavContent: ({ id, testID, }: SkipNavContentProps) => React.ReactElement;
export { SkipNavLink, SkipNavContent };
