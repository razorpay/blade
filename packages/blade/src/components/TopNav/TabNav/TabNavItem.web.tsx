/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import React from 'react';
import styled from 'styled-components';
import type { TabNavItemProps } from './types';
import { useTabNavContext } from './TabNavContext';
import { MIXED_BG_COLOR } from './utils';
import BaseBox from '~components/Box/BaseBox';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { makeBorderSize, makeMotionTime, makeSize, makeSpace } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import { size } from '~tokens/global';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

const StyledTabNavItem = styled.a<{ $isActive?: boolean }>(({ theme, $isActive }) => {
  return {
    ...getTextStyles({
      theme,
      size: 'medium',
      weight: 'medium',
      color: $isActive ? 'interactive.text.gray.normal' : 'interactive.text.gray.subtle',
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
    '&[aria-expanded="true"]': $isActive
      ? {}
      : {
          backgroundColor: theme.colors.interactive.background.gray.default,
        },
    '&:hover': $isActive
      ? {}
      : {
          backgroundColor: theme.colors.interactive.background.gray.default,
        },
  };
});

const StyledTabNavItemWrapper = styled(BaseBox)<{
  isActive?: boolean;
}>(({ theme, isActive }) => {
  const dividerHiderStyle = {
    content: '""',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: makeSize(size[1]),
    height: makeSize(size[16]),
    backgroundColor: MIXED_BG_COLOR,
  } as const;

  return {
    position: 'relative',
    flexShrink: 0,
    padding: `${makeSpace(theme.spacing[2])} ${makeSpace(theme.spacing[1])}`,
    backgroundColor: isActive ? theme.colors.surface.background.gray.moderate : 'transparent',
    borderColor: isActive ? theme.colors.surface.border.gray.muted : 'transparent',
    borderStyle: 'solid',
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderBottomWidth: 0,
    borderTopLeftRadius: makeBorderSize(theme.border.radius.medium),
    borderTopRightRadius: makeBorderSize(theme.border.radius.medium),
    transition: `${makeMotionTime(theme.motion.duration.moderate)} ${theme.motion.easing.standard}`,
    transitionProperty: 'background',

    // Hide the left and right divider by overlaying them with a pseudo element as same color as the background
    ...(isActive
      ? {
          ':before, :after': dividerHiderStyle,
          ':before': {
            left: -2,
          },
          ':after': {
            right: -2,
          },
        }
      : {}),
  };
});

const SelectedBar = styled(BaseBox)<{ isActive?: boolean }>(({ theme, isActive }) => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: makeSpace(theme.spacing[1]),
    borderTopLeftRadius: makeBorderSize(theme.border.radius.medium),
    borderTopRightRadius: makeBorderSize(theme.border.radius.medium),
    backgroundColor: theme.colors.interactive.icon.gray.normal,
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
      <StyledTabNavItem
        ref={ref}
        as={as ?? (href ? 'a' : 'button')}
        to={href}
        href={as ? undefined : href}
        target={target}
        $isActive={isActive}
        {...props}
        {...makeAccessible({ label: accessibilityLabel, current: isActive })}
      >
        {Icon ? (
          <Icon
            size="large"
            color={isActive ? 'interactive.icon.gray.normal' : 'surface.icon.gray.subtle'}
          />
        ) : null}
        {title}
        {trailing ? trailing : null}
      </StyledTabNavItem>
    </StyledTabNavItemWrapper>
  );
};

const TabNavItem = assignWithoutSideEffects(React.forwardRef(_TabNavItem), {
  displayName: 'TabNavItem',
});

export { TabNavItem };
