import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { useCollapsibleContext } from './CollapsibleContext';
import type { ButtonProps } from '~components/Button';
import { Button } from '~components/Button';

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

// todo: ask anurag about this type problem

const CollapsibleButton = ({
  children,
  variant,
  size,
  icon,
  iconPosition,
  isDisabled,
  testID,
  accessibilityLabel,
}: CollapsibleButtonProps): ReactElement => {
  const { setIsExpanded } = useCollapsibleContext();

  const toggleIsExpanded = useCallback(() => setIsExpanded((prevIsExpanded) => !prevIsExpanded), [
    setIsExpanded,
  ]);

  return (
    <Button
      variant={variant}
      size={size}
      icon={icon}
      iconPosition={iconPosition}
      isDisabled={isDisabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      onClick={toggleIsExpanded}
    >
      {children}
    </Button>
  );
};

export { CollapsibleButton, CollapsibleButtonProps };
