import React from 'react';
import type { AvatarProps } from './types';
import { StyledAvatar } from './StyledAvatar';
import { DefaultAvatarIcon } from './DefaultAvatarIcon';

import { useAvatarGroupContext } from './AvatarGroupContext';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import BaseButton from '~components/Button/BaseButton/BaseButton';
import { throwBladeError } from '~utils/logger';

const getInitials = (name: string): string => {
  // Combine first and last name initials
  const names = name.split(' ');
  if (names.length === 1) {
    return name.substring(0, 2);
  }
  return names[0].substring(0, 1) + names[names.length - 1].substring(0, 1);
};

const _Avatar = ({
  name = 'Nitin Kumar',
  color = 'neutral',
  size = 'xsmall',
  variant = 'circle',
  icon,
  href,
  target,
  rel,
  // Image Props
  src,
  alt,
  srcSet,
  crossOrigin,
  referrerPolicy,
  testID,
  ...styledProps
}: AvatarProps): React.ReactElement => {
  if (src && !alt && !name) {
    throwBladeError({
      moduleName: 'Avatar',
      message: '"alt" or "name" prop is required when the "src" prop is provided.',
    });
  }
  const accessibilityLabel = alt ?? name;
  const groupProps = useAvatarGroupContext();
  console.log('🚀 ~ groupProps:', groupProps);
  const avatarSize = groupProps?.size ?? size;

  const {
    onTriggerClick,
    onTriggerKeydown,
    dropdownBaseId,
    isOpen,
    activeIndex,
    hasFooterAction,
    triggererRef,
    dropdownTriggerer,
  } = useDropdown();
  const isInsideDropdown = dropdownTriggerer === 'Avatar';

  const dropDownTriggerProps = isInsideDropdown
    ? {
        ref: triggererRef,
        onClick: onTriggerClick,
        accessibilityProps: {
          label: accessibilityLabel,
          hasPopup: getActionListContainerRole(hasFooterAction, 'DropdownButton'),
          expanded: isOpen,
          controls: `${dropdownBaseId}-actionlist`,
          activeDescendant: activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined,
        },
      }
    : {};

  const getChildrenToRender = (): React.ReactElement => {
    if (src) {
      return (
        <BaseButton
          variant="secondary"
          color={color}
          size="xsmall"
          isPressAnimationDisabled={true}
          imgProps={{
            src,
            alt: alt ?? name,
            srcSet,
            crossOrigin,
            referrerPolicy,
          }}
          href={href}
          target={target}
          rel={rel}
          {...dropDownTriggerProps}
          onKeyDown={(e) => {
            if (isInsideDropdown) {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-explicit-any
              onTriggerKeydown?.({ event: e as any });
            }
          }}
        />
      );
    }

    if (name && !src) {
      return (
        <BaseButton
          variant="secondary"
          color={color}
          size="xsmall"
          iconSize={avatarSize}
          isPressAnimationDisabled={true}
          href={href}
          target={target}
          rel={rel}
          onKeyDown={(e) => {
            if (isInsideDropdown) {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-explicit-any
              onTriggerKeydown?.({ event: e as any });
            }
          }}
          {...dropDownTriggerProps}
        >
          {getInitials(name)}
        </BaseButton>
      );
    }

    return (
      <BaseButton
        variant="secondary"
        color={color}
        size="xsmall"
        iconSize={avatarSize}
        icon={icon ?? DefaultAvatarIcon}
        isPressAnimationDisabled={true}
        href={href}
        target={target}
        rel={rel}
        onKeyDown={(e) => {
          if (isInsideDropdown) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-explicit-any
            onTriggerKeydown?.({ event: e as any });
          }
        }}
        {...dropDownTriggerProps}
      />
    );
  };

  return (
    <StyledAvatar
      {...metaAttribute({ name: MetaConstants.Avatar, testID })}
      {...getStyledProps(styledProps)}
      backgroundColor="surface.background.gray.intense"
      variant={variant}
      color={color}
      size={avatarSize}
    >
      {getChildrenToRender()}
    </StyledAvatar>
  );
};

/**
 * ### Avatar Component
 * 
 * The Avatar component is used to group related buttons together.
 * 
 * ---
 * 
 * #### Usage
 * 
 * ```jsx
  <Avatar name="Nitin Kumar" src="https://avatars.githubusercontent.com/u/46647141?v=4" /> 
 * ```
 *
 *  ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-avatar Avatar Documentation}
 * 
 */
const Avatar = assignWithoutSideEffects(_Avatar, {
  displayName: 'Avatar',
  componentId: 'Avatar',
});

export { Avatar };
export type { AvatarProps };
