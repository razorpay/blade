import { default as React } from 'react';
import { BaseLinkProps } from '../Link/BaseLink';
import { LinkButtonVariantProps } from '../Link';
type DropdownLinkProps = LinkButtonVariantProps & {
    onBlur?: BaseLinkProps['onBlur'];
    onKeyDown?: BaseLinkProps['onKeyDown'];
};
declare const DropdownLink: ({ children, icon, iconPosition, onClick, onBlur, onKeyDown, isDisabled, href, target, rel, accessibilityLabel, size, testID, hitSlop, htmlTitle, ...props }: DropdownLinkProps) => React.ReactElement;
export { DropdownLink };
