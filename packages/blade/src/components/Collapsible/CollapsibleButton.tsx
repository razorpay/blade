import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { useCollapsibleContext } from './CollapsibleContext';
import type { ButtonProps } from '~components/Button';
import { Button } from '~components/Button';
import type { IconComponent } from '~components/Icons';

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
      // Button handles case of icon and children so we don't care about icon type safety here
      icon={icon as IconComponent}
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
