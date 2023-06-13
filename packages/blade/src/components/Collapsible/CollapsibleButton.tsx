import type { ReactElement } from 'react';
import { useCallback } from 'react';
// This has to be a relative import otherwise plugin-dts will go 💥 https://github.com/razorpay/blade/issues/701
import type { ButtonProps } from '../Button';
import { useCollapsible } from './CollapsibleContext';
import type { IconComponent } from '~components/Icons';
import { MetaConstants, assignWithoutSideEffects, makeAccessible } from '~utils';
import BaseButton from '~components/Button/BaseButton';

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
    <BaseButton
      variant={variant}
      size={size}
      // Button handles case of icon and children so we don't care about icon type safety here
      icon={icon as IconComponent}
      iconPosition={iconPosition}
      isDisabled={isDisabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      onClick={toggleIsExpanded}
      {...makeAccessible({ controls: collapsibleBodyId, expanded: isExpanded })}
    >
      {children}
    </BaseButton>
  );
};

const CollapsibleButton = assignWithoutSideEffects(_CollapsibleButton, {
  componentId: MetaConstants.CollapsibleButton,
});

export { CollapsibleButton, CollapsibleButtonProps };
