import React from 'react';
import styled from 'styled-components';
import { useTopNavContext } from '../TopNavContext';
import type { TabNavItemProps } from './types';
import { useTabNavContext } from './TabNavContext';
import { MIXED_BG_COLOR } from './utils';
import BaseBox from '~components/Box/BaseBox';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { makeBorderSize, makeMotionTime, makeSize, makeSpace } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import { size } from '~tokens/global';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { mergeRefs } from '~utils/useMergeRefs';
import type { BoxProps } from '~components/Box';
import getIn from '~utils/lodashButBetter/get';

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
    '&:hover': $isActive
      ? {}
      : {
          backgroundColor: theme.colors.interactive.background.gray.default,
        },
  };
});

const StyledTabNavItemWrapper = styled(BaseBox)<{
  isActive?: boolean;
  dividerHiderColor: BoxProps['backgroundColor'];
}>(({ theme, isActive, dividerHiderColor }) => {
  const dividerHiderStyle = {
    content: '""',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: makeSize(size[1]),
    height: '50%',
    backgroundColor: getIn(theme.colors, dividerHiderColor as never, MIXED_BG_COLOR),
  } as const;

  return {
    position: 'relative',
    flexShrink: 0,
    padding: `${makeSpace(theme.spacing[2])} ${makeSpace(theme.spacing[1])}`,
    backgroundColor: isActive ? theme.colors.surface.background.gray.intense : 'transparent',
    borderColor: isActive ? theme.colors.surface.border.gray.muted : 'transparent',
    borderStyle: 'solid',
    borderBottomWidth: 0,
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderTopLeftRadius: makeBorderSize(theme.border.radius.medium),
    borderTopRightRadius: makeBorderSize(theme.border.radius.medium),
    // Animation
    transform: isActive ? `translateY(${makeSize(size[2])})` : 'none',
    transition: `${makeMotionTime(theme.motion.duration.moderate)} ${
      theme.motion.easing.standard.effective
    }`,
    transitionProperty: 'background, transform',

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
    transition: `${makeMotionTime(theme.motion.duration.moderate)} ${
      theme.motion.easing.standard.effective
    }`,
    transitionProperty: 'opacity',
  };
});

const _TabNavItem: React.ForwardRefRenderFunction<HTMLAnchorElement, TabNavItemProps> = (
  { as, children, isActive, icon: Icon, trailing, accessibilityLabel, href, target, ...props },
  ref,
): React.ReactElement => {
  const { containerRef, hasOverflow } = useTabNavContext();
  const { backgroundColor } = useTopNavContext();
  const linkRef = React.useRef<HTMLAnchorElement>(null);

  // Scroll the active tab into view
  // Only if the tab is very close to the edge
  // Or if the tab is out of view
  useIsomorphicLayoutEffect(() => {
    if (!isActive || !hasOverflow) return;
    if (!('requestAnimationFrame' in window)) return;

    window.requestAnimationFrame(() => {
      if (!linkRef.current || !containerRef.current) return;

      const buffer = 100;
      const container = containerRef.current;
      const linkElement = linkRef.current;
      const containerRect = container.getBoundingClientRect();
      const linkRect = linkElement.getBoundingClientRect();
      const isCloseToStart = linkRect.left < containerRect.left + buffer;
      const isCloseToEnd = linkRect.right > containerRect.right - buffer;

      if (isCloseToStart || isCloseToEnd) {
        linkElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  }, [hasOverflow, isActive]);

  return (
    <StyledTabNavItemWrapper isActive={isActive} dividerHiderColor={backgroundColor}>
      <SelectedBar isActive={isActive} />
      <StyledTabNavItem
        ref={mergeRefs(ref, linkRef)}
        as={as ?? 'a'}
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
        {children}
        {trailing ? trailing : null}
      </StyledTabNavItem>
    </StyledTabNavItemWrapper>
  );
};

const TabNavItem = assignWithoutSideEffects(React.forwardRef(_TabNavItem), {
  displayName: 'TabNavItem',
});

export { TabNavItem };
