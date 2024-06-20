import React from 'react';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import type { LinkProps } from '~components/Link';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';

type TabNavItemProps = {
  /**
   * href of the link
   */
  href?: LinkProps['href'];
  /**
   * Anchor tag `target` attribute
   */
  target?: LinkProps['target'];
  /**
   * as prop to pass ReactRouter's Link component.
   *
   * @default 'a'
   *
   * @example
   * ```jsx
   * import { Link } from 'react-router-dom';
   *
   * <TabNavItem as={Link} />
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as: React.ComponentType<any>;
  /**
   * Selected state of the navigation item.
   *
   * @default false
   */
  isActive?: boolean;
  /**
   * Element to render before the navigation item.
   *
   * @default undefined
   */
  leading?: IconComponent;
  /**
   * Element to render inside the navigation item.
   *
   * This can either be a string or JSX element (eg: Menu component)
   */
  children?: React.ReactNode;
  /**
   * Accessibility label for the navigation item.
   */
  accessibilityLabel?: string;
};

const StyledTabNavItem = styled.a<{ isActive?: boolean }>(({ theme, isActive }) => {
  return {
    ...getTextStyles({
      theme,
      size: 'medium',
      weight: 'medium',
      color: 'interactive.text.gray.normal',
    }),
    flex: 1,
    display: 'flex',
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
    '&:hover': isActive
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
    width: 2,
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
    // TODO: Check in figma for actual animation values
    transform: isActive ? 'translateY(2px)' : 'none',
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
    // TODO: Check in figma for actual animation values
    opacity: isActive ? 1 : 0,
    transition: `${makeMotionTime(theme.motion.duration.moderate)} ${
      theme.motion.easing.standard.effective
    }`,
    transitionProperty: 'opacity',
  };
});

const TabNavItem = ({
  children,
  isActive,
  leading: Leading,
  as,
  accessibilityLabel,
  href,
  target,
}: TabNavItemProps): React.ReactElement => {
  return (
    <StyledTabNavItemWrapper isActive={isActive}>
      <SelectedBar isActive={isActive} />
      <StyledTabNavItem
        as={as ?? 'a'}
        to={href}
        href={as ? undefined : href}
        target={target}
        isActive={isActive}
        {...makeAccessible({ label: accessibilityLabel, current: isActive })}
      >
        {Leading ? (
          <Leading
            size="large"
            color={isActive ? 'interactive.icon.gray.normal' : 'surface.icon.gray.subtle'}
          />
        ) : null}
        {children}
      </StyledTabNavItem>
    </StyledTabNavItemWrapper>
  );
};

export { TabNavItem };
export type { TabNavItemProps };
