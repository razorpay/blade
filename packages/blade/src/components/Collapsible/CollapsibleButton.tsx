import type { ReactElement } from 'react';
import { forwardRef, useCallback } from 'react';
import { useCollapsible } from './CollapsibleContext';
import type { ButtonProps } from '~components/Button';
import type { IconComponent } from '~components/Icons';
import BaseButton from '~components/Button/BaseButton';
import type { BladeElementRef, DataAnalyticsAttribute } from '~utils/types';
import { MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { isReactNative } from '~utils';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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
> &
  DataAnalyticsAttribute;

const _CollapsibleButton: React.ForwardRefRenderFunction<
  BladeElementRef,
  CollapsibleButtonProps
> = (
  { children, variant, size, icon, iconPosition, isDisabled, testID, accessibilityLabel, ...rest },
  ref,
): ReactElement => {
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
      ref={ref}
      onClick={toggleIsExpanded}
      alignSelf={isReactNative() ? 'flex-start' : undefined}
      accessibilityProps={{
        label: accessibilityLabel,
        controls: collapsibleBodyId,
        expanded: isExpanded,
      }}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </BaseButton>
  );
};

const CollapsibleButton = assignWithoutSideEffects(forwardRef(_CollapsibleButton), {
  displayName: 'CollapsibleButton',
  componentId: MetaConstants.CollapsibleButton,
});

export type { CollapsibleButtonProps };
export { CollapsibleButton };
