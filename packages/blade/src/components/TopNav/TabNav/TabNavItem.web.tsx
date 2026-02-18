/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import React from 'react';
import styled from 'styled-components';
import type { TabNavItemProps } from './types';
import { useTabNavContext } from './TabNavContext';
import BaseBox from '~components/Box/BaseBox';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

const StyledTabNavItem = styled.a<{ $isActive?: boolean }>(({ theme, $isActive }) => {
  return {
    ...getTextStyles({
      theme,
      size: 'medium',
      weight: $isActive ? 'semibold' : 'medium',
      color: $isActive ? 'surface.text.staticWhite.normal' : 'surface.text.staticWhite.subtle',
    }),
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
    '&[aria-expanded="true"]': $isActive ? {} : {},
    '&:hover': $isActive
      ? {}
      : {
          color: theme.colors.interactive.text.staticWhite.normal,
        },
    '&:focus-visible': {
      ...getFocusRingStyles({ theme }),
      color: theme.colors.interactive.text.staticWhite.normal,
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
  };
});

const SelectedBar = styled(BaseBox)<{ isActive?: boolean }>(({ theme, isActive }) => {
  return {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: makeSpace(theme.border.width.thin),
    borderTopLeftRadius: makeBorderSize(theme.border.radius.medium),
    borderTopRightRadius: makeBorderSize(theme.border.radius.medium),
    background: `linear-gradient(90deg, transparent 0%, ${theme.colors.surface.icon.staticWhite.normal} 20%, ${theme.colors.surface.icon.staticWhite.normal} 80.29%, transparent 100%)`,
    pointerEvents: 'none',
    // Animation
    opacity: isActive ? 1 : 0,
    transition: `${makeMotionTime(theme.motion.duration.moderate)} ${theme.motion.easing.standard}`,
    transitionProperty: 'opacity',
  };
});

const _TabNavItem: React.ForwardRefRenderFunction<HTMLAnchorElement, TabNavItemProps> = (
  {
    as,
    title,
    isActive,
    icon: Icon,
    trailing,
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
  const bodyRef = React.useRef<HTMLDivElement>(null);

  // Update the controlledItems with the tabWidth and offsetX
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

  return (
    <StyledTabNavItemWrapper
      ref={bodyRef}
      isActive={isActive}
      {...metaAttribute({ name: MetaConstants.TabNavItem })}
    >
      <SelectedBar isActive={isActive} />
      <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
        <StyledTabNavItem
          ref={ref}
          as={as ?? (href ? 'a' : 'button')}
          to={href}
          href={as ? undefined : href}
          target={target}
          $isActive={isActive}
          {...props}
          {...metaAttribute({ name: MetaConstants.TabNavItemLink })}
          {...makeAccessible({ label: accessibilityLabel, current: isActive })}
        >
          {Icon ? (
            <Icon
              size="medium"
              color={
                isActive ? 'surface.icon.staticWhite.normal' : 'surface.icon.staticWhite.subtle'
              }
            />
          ) : null}
          {title}
          {trailing ? trailing : null}
        </StyledTabNavItem>
      </BladeProvider>
    </StyledTabNavItemWrapper>
  );
};

const TabNavItem = assignWithoutSideEffects(React.forwardRef(_TabNavItem), {
  displayName: 'TabNavItem',
});

export { TabNavItem };
