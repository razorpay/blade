import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { useCollapsible } from './CollapsibleContext';
import { CollapsibleChevronIcon } from './CollapsibleChevronIcon';
import type { LinkProps } from '~components/Link';
import { Link } from '~components/Link';
import { MetaConstants, assignWithoutSideEffects } from '~utils';

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
    <Link
      variant="button"
      size={size}
      icon={CollapsibleChevronIcon}
      iconPosition="right"
      isDisabled={isDisabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
      // @ts-ignore ignore this for native where aria-controls has no effect
      accessibilityControls={collapsibleBodyId}
      accessibilityExpanded={isExpanded}
      onClick={toggleIsExpanded}
    >
      {children}
    </Link>
  );
};

const CollapsibleLink = assignWithoutSideEffects(_CollapsibleLink, {
  componentId: MetaConstants.CollapsibleLink,
});

export { CollapsibleLink, CollapsibleLinkProps };
