/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import React from 'react';
import styled from 'styled-components';
import { makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import { opacity } from '~tokens/global';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { useTopNavContext } from '../TopNavContext';
import type { TabNavItemProps, TabNavIconProp } from './types';
import { useTabNavContext } from './TabNavContext';
import BaseBox from '~components/Box/BaseBox';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { useTheme } from '~components/BladeProvider';
import type { Theme } from '~components/BladeProvider';
import type { IconComponent } from '~components/Icons';
import { RayIcon } from '~components/Icons';

const isIconObjectProp = (
  icon: TabNavIconProp,
): icon is { default: IconComponent; selected: IconComponent } => {
  return typeof icon === 'object' && icon !== null && 'default' in icon;
};

const isRayIcon = (icon?: TabNavIconProp): boolean => {
  if (!icon) return false;
  const defaultIcon = isIconObjectProp(icon) ? icon.default : icon;
  return defaultIcon === RayIcon;
};

const getGlowColor = ({
  icon,
  isPrimaryVariant,
  theme,
}: {
  icon?: TabNavIconProp;
  isPrimaryVariant: boolean;
  theme: Theme;
}): string => {
  if (isRayIcon(icon) && !isPrimaryVariant) return theme.colors.surface.icon.onSea.onSubtle;
  if (isPrimaryVariant) return theme.colors.surface.icon.staticWhite.normal;
  return theme.colors.surface.background.primary.intense;
};

const getForegroundColors = (
  isPrimaryVariant: boolean,
  theme: Theme,
): {
  normal: string;
  subtle: string;
  hover: string;
} => {
  if (isPrimaryVariant) {
    return {
      normal: theme.colors.interactive.text.onPrimary.normal,
      subtle: theme.colors.interactive.text.onPrimary.muted,
      hover: theme.colors.interactive.text.onPrimary.normal,
    };
  }
  return {
    normal: theme.colors.surface.text.staticWhite.normal,
    subtle: theme.colors.surface.text.staticWhite.subtle,
    hover: theme.colors.interactive.text.staticWhite.normal,
  };
};

const getIconColor = (isPrimaryVariant: boolean, isActive: boolean | undefined) => {
  if (isPrimaryVariant) {
    return isActive ? 'interactive.icon.onPrimary.normal' : 'interactive.icon.onPrimary.muted';
  }
  return isActive ? 'surface.icon.staticWhite.normal' : 'surface.icon.staticWhite.subtle';
};

const StyledTabNavItem = styled.a<{
  $isActive?: boolean;
  $foregroundColors: ReturnType<typeof getForegroundColors>;
}>(({ theme, $isActive, $foregroundColors }) => {
  return {
    ...getTextStyles({
      theme,
      size: 'medium',
      weight: $isActive ? 'semibold' : 'medium',
    }),
    color: $isActive ? $foregroundColors.normal : $foregroundColors.subtle,
    flex: 1,
    display: 'flex',
    gap: makeSpace(theme.spacing[2]),
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    paddingTop: makeSpace(theme.spacing[3]),
    paddingBottom: makeSpace(theme.spacing[3]),
    paddingLeft: makeSpace(theme.spacing[4]),
    paddingRight: makeSpace(theme.spacing[4]),
    borderRadius: makeBorderSize(theme.border.radius.medium),
    // reset button styles
    border: 'none',
    background: 'none',
    opacity: $isActive ? 1 : opacity[1000],
    transition: `opacity ${makeMotionTime(theme.motion.duration.moderate)} ${
      theme.motion.easing.standard
    }`,
    '&[aria-expanded="true"]': $isActive ? {} : {},
    '&:hover': $isActive
      ? {}
      : {
          opacity: 1,
          color: $foregroundColors.hover,
        },
    '&:focus-visible': {
      ...getFocusRingStyles({ theme }),
      opacity: 1,
      color: $foregroundColors.hover,
    },
    '&:active': {
      opacity: 1,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      zIndex: 1, // ensures it sits above the wrapper
    },
  };
});

const StyledTabNavItemWrapper = styled(BaseBox)<{
  isActive?: boolean;
}>(({ theme, isActive }) => {
  return {
    position: 'relative',
    flexShrink: 0,
    padding: `${makeSpace(theme.spacing[2])} ${makeSpace(theme.spacing[1])}`,
    backgroundColor: 'transparent',
    borderColor: isActive ? theme.colors.surface.border.gray.muted : 'transparent',
    borderTopLeftRadius: makeBorderSize(theme.border.radius.medium),
    borderTopRightRadius: makeBorderSize(theme.border.radius.medium),
    transition: `${makeMotionTime(theme.motion.duration.moderate)} ${theme.motion.easing.standard}`,
    transitionProperty: 'background',
    zIndex: 1,
    cursor: 'pointer',
  };
});

const _TabNavItem: React.ForwardRefRenderFunction<HTMLAnchorElement, TabNavItemProps> = (
  {
    as,
    title,
    isActive,
    icon,
    trailing,
    titleSuffix,
    accessibilityLabel,
    href,
    target,
    // @ts-expect-error - This prop is only used internally
    __isInsideTabNavItems,
    // @ts-expect-error - This prop is only used internally
    __index,
    ...props
  },
  ref,
): React.ReactElement => {
  const { setControlledItems } = useTabNavContext();
  const { theme } = useTheme();
  const topNavContext = useTopNavContext();
  const bodyRef = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!bodyRef.current) return;
    if (!__isInsideTabNavItems) return;
    setControlledItems((prev) => {
      return prev.map((item, index) => {
        if (index !== __index) return item;
        const bounds = bodyRef?.current?.getBoundingClientRect()!;
        const tabWidth = bounds.width;
        const offsetX = bounds.right;
        return {
          ...item,
          tabWidth,
          offsetX,
        };
      });
    });
  }, [__isInsideTabNavItems, __index, setControlledItems]);

  let ResolvedIcon: IconComponent | undefined;
  if (icon) {
    if (isIconObjectProp(icon)) {
      ResolvedIcon = isActive ? icon.selected : icon.default;
    } else {
      ResolvedIcon = icon;
    }
  }

  const isPrimaryVariant = topNavContext?.variant === 'primary';
  const foregroundColors = getForegroundColors(isPrimaryVariant, theme);
  const glowColor = getGlowColor({ icon, isPrimaryVariant, theme });
  const iconColor = getIconColor(isPrimaryVariant, isActive);

  return (
    <StyledTabNavItemWrapper
      ref={bodyRef}
      isActive={isActive}
      data-active={isActive ? 'true' : 'false'}
      data-glow-color={glowColor}
      {...metaAttribute({ name: MetaConstants.TabNavItem })}
    >
      <StyledTabNavItem
        ref={ref}
        as={as ?? (href ? 'a' : 'button')}
        to={href}
        href={as ? undefined : href}
        target={target}
        $isActive={isActive}
        $foregroundColors={foregroundColors}
        {...props}
        {...metaAttribute({ name: MetaConstants.TabNavItemLink })}
        {...makeAccessible({ label: accessibilityLabel, current: isActive })}
      >
        {ResolvedIcon ? <ResolvedIcon size="medium" color={iconColor} /> : null}
        {title}
        {titleSuffix ? titleSuffix : null}
        {trailing ? trailing : null}
      </StyledTabNavItem>
    </StyledTabNavItemWrapper>
  );
};

const TabNavItem = assignWithoutSideEffects(React.forwardRef(_TabNavItem), {
  displayName: 'TabNavItem',
});

export { TabNavItem };
