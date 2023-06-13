import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { useCollapsible } from './CollapsibleContext';
import type { ButtonProps } from '~components/Button';
import { Button } from '~components/Button';
import type { IconComponent } from '~components/Icons';
import { MetaConstants, assignWithoutSideEffects } from '~utils';

type CollapsibleButtonProps = Pick<
  ButtonProps,
  | 'variant'
  | 'size'
  | 'iconPosition'
  | 'isDisabled'
  | 'testID'
  | 'accessibilityLabel'
  | 'icon'
  | 'children'
>;

const _CollapsibleButton = ({
  children,
  variant,
  size,
  icon,
  iconPosition,
  isDisabled,
  testID,
  accessibilityLabel,
}: CollapsibleButtonProps): ReactElement => {
  const { onExpandChange, isExpanded, collapsibleBodyId } = useCollapsible();

  const toggleIsExpanded = useCallback(() => onExpandChange(!isExpanded), [
    onExpandChange,
    isExpanded,
  ]);

  return (
    <Button
      variant={variant}
      size={size}
      // Button handles case of icon and children so we don't care about icon type safety here
      icon={icon as IconComponent}
      iconPosition={iconPosition}
      isDisabled={isDisabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityControls={collapsibleBodyId}
      accessibilityExpanded={isExpanded}
      onClick={toggleIsExpanded}
    >
      {children}
    </Button>
  );
};

const CollapsibleButton = assignWithoutSideEffects(_CollapsibleButton, {
  componentId: MetaConstants.CollapsibleButton,
});

export { CollapsibleButton, CollapsibleButtonProps };
