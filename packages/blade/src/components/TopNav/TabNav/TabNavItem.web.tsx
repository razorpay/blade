import React from 'react';
import styled from 'styled-components';
import type { TabNavItemProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { makeBorderSize, makeMotionTime, makeSize, makeSpace } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import { size } from '~tokens/global';

const StyledTabNavItem = styled.a<{ $isActive?: boolean }>(({ theme, $isActive }) => {
  return {
    ...getTextStyles({
      theme,
      size: 'medium',
      weight: 'medium',
      color: 'interactive.text.gray.normal',
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

const StyledTabNavItemWrapper = styled(BaseBox)<{ isActive?: boolean }>(({ theme, isActive }) => {
  const dividerHiderStyle = {
    content: '""',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: makeSize(size[2]),
    height: '80%',
    backgroundColor: theme.colors.surface.background.gray.subtle,
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
            left: -3,
          },
          ':after': {
            right: -3,
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
  {
    as,
    children,
    isActive,
    icon: Icon,
    trailing: Trailing,
    accessibilityLabel,
    href,
    target,
    ...props
  },
  ref,
): React.ReactElement => {
  return (
    <StyledTabNavItemWrapper isActive={isActive}>
      <SelectedBar isActive={isActive} />
      <StyledTabNavItem
        ref={ref}
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
        {Trailing ? Trailing : null}
      </StyledTabNavItem>
    </StyledTabNavItemWrapper>
  );
};

const TabNavItem = assignWithoutSideEffects(React.forwardRef(_TabNavItem), {
  displayName: 'TabNavItem',
});

export { TabNavItem };
