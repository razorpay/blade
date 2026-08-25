import React from 'react';
import { FloatingActionButtonContainer } from './FloatingActionButtonContainer';
import type { FloatingActionButtonProps } from './types';
import BaseButton from '~components/Button/BaseButton';
import { componentZIndices } from '~utils/componentZIndices';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeElementRef } from '~utils/types';

/**
 * The shared spinner map would render a white spinner on the white button, where
 * it is invisible.
 */
const colorToSpinnerColor = {
  primary: 'white',
  black: 'white',
  white: 'neutral',
} as const;

/**
 * ### FloatingActionButton component
 *
 * A persistent, elevated button anchored to the bottom of the viewport, used for the single most important action on a screen.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
 * <FloatingActionButton icon={PlusIcon} onClick={() => createPayment()}>
 *   Create payment
 * </FloatingActionButton>
 *
 * // icon-only, accessibilityLabel is required
 * <FloatingActionButton
 *   icon={PlusIcon}
 *   accessibilityLabel="Create payment"
 *   onClick={() => createPayment()}
 * />
 * ```
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-floatingactionbutton--docs FloatingActionButton Documentation}
 */
const _FloatingActionButton: React.ForwardRefRenderFunction<
  BladeElementRef,
  FloatingActionButtonProps
> = (
  {
    children,
    icon,
    color = 'primary',
    placement = 'bottom-end',
    offset = 'spacing.5',
    zIndex = componentZIndices.fab,
    isDisabled = false,
    isLoading = false,
    href,
    target,
    rel,
    type = 'button',
    accessibilityLabel,
    onClick,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    testID,
    ...rest
  },
  ref,
) => {
  return (
    <FloatingActionButtonContainer
      placement={placement}
      offset={offset}
      zIndex={zIndex}
      testID={testID}
      {...rest}
    >
      <BaseButton
        ref={ref}
        icon={icon}
        variant="primary"
        color={color}
        size="large"
        _borderRadius="max"
        _iconSize="xlarge"
        _spinnerColor={colorToSpinnerColor[color]}
        accessibilityProps={{ label: accessibilityLabel }}
        href={href}
        target={target}
        rel={rel}
        type={type}
        isDisabled={isDisabled}
        isLoading={isLoading}
        onClick={onClick}
        onBlur={onBlur}
        onFocus={onFocus}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </BaseButton>
    </FloatingActionButtonContainer>
  );
};

const FloatingActionButton = assignWithoutSideEffects(React.forwardRef(_FloatingActionButton), {
  displayName: 'FloatingActionButton',
  componentId: 'FloatingActionButton',
});

export { FloatingActionButton };
