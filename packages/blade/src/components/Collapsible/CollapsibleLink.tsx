import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { useCollapsible } from './CollapsibleContext';
import { CollapsibleChevronIcon } from './CollapsibleChevronIcon';
import type { LinkProps } from '~components/Link';
import { MetaConstants } from '~utils/metaAttribute';
import { BaseLink } from '~components/Link/BaseLink';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';

type CollapsibleLinkProps = Pick<
  LinkProps,
  'color' | 'size' | 'isDisabled' | 'testID' | 'accessibilityLabel' | 'children'
> &
  StyledPropsBlade;

const _CollapsibleLink = ({
  children,
  size,
  color = 'primary',
  isDisabled,
  testID,
  accessibilityLabel,
  ...styledProps
}: CollapsibleLinkProps): ReactElement => {
  const { onExpandChange, isExpanded, collapsibleBodyId } = useCollapsible();

  const toggleIsExpanded = useCallback(() => onExpandChange(!isExpanded), [
    onExpandChange,
    isExpanded,
  ]);

  return (
    <BaseLink
      variant="button"
      size={size}
      color={color}
      icon={CollapsibleChevronIcon}
      iconPosition="right"
      isDisabled={isDisabled}
      testID={testID}
      onClick={toggleIsExpanded}
      accessibilityProps={{
        label: accessibilityLabel,
        controls: collapsibleBodyId,
        expanded: isExpanded,
      }}
      {...getStyledProps(styledProps)}
    >
      {children}
    </BaseLink>
  );
};

const CollapsibleLink = assignWithoutSideEffects(_CollapsibleLink, {
  componentId: MetaConstants.CollapsibleLink,
});

export type { CollapsibleLinkProps };
export { CollapsibleLink };
