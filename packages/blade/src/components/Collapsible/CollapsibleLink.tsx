import type { ReactElement } from 'react';
import { useCallback } from 'react';
// This has to be a relative import otherwise plugin-dts will go 💥 https://github.com/razorpay/blade/issues/701
import type { LinkProps } from '../Link';
import { useCollapsible } from './CollapsibleContext';
import { CollapsibleChevronIcon } from './CollapsibleChevronIcon';
import { MetaConstants } from '~utils/metaAttribute';
import { BaseLink } from '~components/Link/BaseLink';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

type CollapsibleLinkProps = Pick<
  LinkProps,
  'size' | 'isDisabled' | 'testID' | 'accessibilityLabel' | 'children'
>;

const _CollapsibleLink = ({
  children,
  size,
  isDisabled,
  testID,
  accessibilityLabel,
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
    >
      {children}
    </BaseLink>
  );
};

const CollapsibleLink = assignWithoutSideEffects(_CollapsibleLink, {
  componentId: MetaConstants.CollapsibleLink,
});

export { CollapsibleLink, CollapsibleLinkProps };
