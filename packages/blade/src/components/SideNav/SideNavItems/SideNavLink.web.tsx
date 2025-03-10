import React from 'react';
import styled from 'styled-components';
import { FloatingFocusManager, FloatingPortal, useFloating } from '@floating-ui/react';
import { NavLinkContext, useNavLink, useSideNav } from '../SideNavContext';
import type { SideNavLinkProps } from '../types';
import { classes, getNavItemTransition, NAV_ITEM_HEIGHT } from '../tokens';
import { Box } from '~components/Box';
import { makeBorderSize, makeSize, makeSpace } from '~utils';
import { BaseText } from '~components/Typography/BaseText';
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { useCollapsible } from '~components/Collapsible/CollapsibleContext';
import { Collapsible, CollapsibleBody } from '~components/Collapsible';
import { makeAccessible } from '~utils/makeAccessible';
import { useFirstRender } from '~utils/useFirstRender';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { throwBladeError } from '~utils/logger';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { Text } from '~components/Typography';
import { TooltipifyComponent } from '~utils/TooltipifyComponent';

const { SHOW_ON_LINK_HOVER, HIDE_WHEN_COLLAPSED, STYLED_NAV_LINK } = classes;

const StyledNavLinkContainer = styled(BaseBox)<{ $hasDescription: boolean }>((props) => {
  return {
    width: '100%',
    [`.${SHOW_ON_LINK_HOVER}`]: {
      opacity: 0,
      '&:focus-within, &:focus-visible': {
        opacity: 1,
      },
    },
    '&:hover': {
      [`.${SHOW_ON_LINK_HOVER}`]: {
        opacity: 1,
      },

      [`.${STYLED_NAV_LINK}`]: {
        color: props.theme.colors.interactive.text.gray.normal,
        backgroundColor: props.theme.colors.interactive.background.gray.default,
      },
    },
    [`.${STYLED_NAV_LINK}`]: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: props.$hasDescription ? undefined : makeSize(NAV_ITEM_HEIGHT),
      width: '100%',
      textDecoration: 'none',
      overflow: 'hidden',
      flexWrap: 'nowrap',
      cursor: 'pointer',
      padding: `${makeSpace(props.theme.spacing[props.$hasDescription ? 3 : 0])} ${makeSpace(
        props.theme.spacing[4],
      )}`,
      margin: `${makeSpace(props.theme.spacing[1])} ${makeSpace(props.theme.spacing[0])}`,
      color: props.theme.colors.interactive.text.gray.subtle,
      borderRadius: props.theme.border.radius.medium,
      borderWidth: makeBorderSize(props.theme.border.width.none),
      backgroundColor: props.theme.colors.transparent,
      transition: getNavItemTransition(props.theme),
      '&[aria-current]': {
        color: props.theme.colors.interactive.text.primary.subtle,
        backgroundColor: props.theme.colors.interactive.background.primary.faded,
      },
      '&[aria-current]:hover': {
        color: props.theme.colors.interactive.text.primary.normal,
        backgroundColor: props.theme.colors.interactive.background.primary.fadedHighlighted,
      },
      '&:focus-visible': {
        ...getFocusRingStyles({ theme: props.theme }),
      },
    },
  };
});

const NavLinkIconTitle = ({
  icon: Icon,
  title,
  description,
  titleSuffix,
  isActive,
  trailing,
  isL1Item,
}: Pick<
  SideNavLinkProps,
  'title' | 'isActive' | 'trailing' | 'description' | 'icon' | 'titleSuffix'
> & {
  isL1Item: boolean;
}): React.ReactElement => {
  return (
    <Box width="100%" textAlign="left">
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
          {Icon ? (
            <BaseBox display="flex" flexDirection="row" alignItems="center">
              <Icon size="medium" color="currentColor" />
            </BaseBox>
          ) : null}
          <BaseText
            truncateAfterLines={1}
            color="currentColor"
            fontWeight="medium"
            fontSize={100}
            lineHeight={100}
            as="p"
            className={isL1Item ? HIDE_WHEN_COLLAPSED : ''}
          >
            {title}
          </BaseText>
          {titleSuffix ? (
            <BaseBox display="flex" alignItems="center">
              {titleSuffix}
            </BaseBox>
          ) : null}
        </Box>
        <Box display="flex" alignItems="center">
          {trailing}
        </Box>
      </Box>
      {!isL1Item && description ? (
        <Text
          size="small"
          marginLeft="spacing.7"
          textAlign="left"
          weight="medium"
          color={isActive ? 'interactive.text.primary.muted' : 'interactive.text.gray.muted'}
          truncateAfterLines={1}
        >
          {description}
        </Text>
      ) : null}
    </Box>
  );
};

const L3Trigger = ({
  title,
  description,
  icon,
  as,
  href,
  target,
  titleSuffix,
  tooltip,
  onClick,
}: Pick<
  SideNavLinkProps,
  | 'title'
  | 'description'
  | 'icon'
  | 'as'
  | 'href'
  | 'titleSuffix'
  | 'tooltip'
  | 'target'
  | 'onClick'
>): React.ReactElement => {
  const { onExpandChange, isExpanded, collapsibleBodyId } = useCollapsible();

  const toggleCollapse = (e: React.MouseEvent): void => {
    onClick?.(e);
    onExpandChange(!isExpanded);
  };
  const iconProps = {
    size: 'medium',
    color: 'currentColor',
  } as const;

  return (
    <TooltipifyComponent tooltip={tooltip}>
      <StyledNavLinkContainer $hasDescription={Boolean(description)}>
        <BaseBox
          className={STYLED_NAV_LINK}
          as={href ? as : 'button'}
          to={href}
          target={target}
          onClick={(e: React.MouseEvent) => toggleCollapse(e)}
          {...makeAccessible({ expanded: isExpanded, controls: collapsibleBodyId })}
        >
          <NavLinkIconTitle
            title={title}
            description={description}
            icon={icon}
            isL1Item={false}
            titleSuffix={titleSuffix}
            trailing={
              isExpanded ? <ChevronUpIcon {...iconProps} /> : <ChevronDownIcon {...iconProps} />
            }
          />
        </BaseBox>
      </StyledNavLinkContainer>
    </TooltipifyComponent>
  );
};

/**
 * This is the curved line that appears when you select L3 item
 */
const CurvedVerticalLine = styled(BaseBox)((props) => {
  const { colors, border, spacing } = props.theme;
  return {
    borderWidth: makeBorderSize(props.theme.border.width.thin),
    borderColor: `${colors.transparent} ${colors.transparent} ${colors.surface.border.primary.muted} ${colors.surface.border.primary.muted}`,
    borderStyle: 'solid',
    borderRadius: `${makeBorderSize(border.radius.none)} ${makeBorderSize(
      border.radius.none,
    )} ${makeBorderSize(border.radius.none)} ${makeBorderSize(border.radius.medium)}`,
    // We set veritical line infinitely tall (full size of screen) and then hide the overflowing part from top
    height: '100vh',
    position: 'absolute',
    // We want the active line to be positioned in the middle of item's height thus divide by 2
    top: `calc(-100vh + ${makeSize(NAV_ITEM_HEIGHT / 2)})`,
    width: makeSpace(spacing[3]),
    left: makeSpace(-spacing[3]),
  };
});

const SideNavLink = ({
  title,
  description,
  href,
  children,
  titleSuffix,
  trailing,
  isActive,
  icon,
  tooltip,
  as,
  target,
  onClick,
  ...rest
}: SideNavLinkProps): React.ReactElement => {
  const {
    l2PortalContainerRef,
    onLinkActiveChange,
    closeMobileNav,
    isL1Collapsed,
    setIsL1Collapsed,
  } = useSideNav();
  const { level: _prevLevel } = useNavLink();
  const prevLevel = _prevLevel ?? 0;
  const currentLevel = prevLevel + 1;
  const isL2Trigger = Boolean(children) && currentLevel === 1;
  const isL3Trigger = Boolean(children) && currentLevel === 2;

  if (__DEV__) {
    if (Boolean(children) && currentLevel >= 3) {
      throwBladeError({
        message:
          'SideNav only supports nesting upto L3 but L4 nesting was found. Check the nesting of your SideNavLevel items',
        moduleName: 'SideNavLink',
      });
    }

    if (currentLevel === 1 && Boolean(description)) {
      throwBladeError({
        message: 'Description is not supported for L1 items',
        moduleName: 'SideNavLink',
      });
    }
  }

  const isFirstRender = useFirstRender();

  const { refs, context } = useFloating({
    open: isActive,
  });

  useIsomorphicLayoutEffect(() => {
    onLinkActiveChange?.({
      level: currentLevel,
      title,
      isActive: Boolean(isActive),
      isL2Trigger,
      isFirstRender,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <NavLinkContext.Provider value={{ level: currentLevel, title }}>
      {isL3Trigger ? (
        <Collapsible
          defaultIsExpanded={isActive}
          _dangerouslyDisableValidations={true}
          _shouldApplyWidthRestrictions={false}
        >
          <L3Trigger
            title={title}
            description={description}
            icon={icon}
            as={as}
            href={href}
            titleSuffix={titleSuffix}
            onClick={onClick}
          />
          <CollapsibleBody width="100%" _hasMargin={false}>
            <Box position="relative">{children}</Box>
          </CollapsibleBody>
        </Collapsible>
      ) : (
        <>
          <StyledNavLinkContainer
            $hasDescription={currentLevel !== 1 && Boolean(description)}
            position="relative"
          >
            <TooltipifyComponent tooltip={tooltip}>
              <BaseBox
                className={STYLED_NAV_LINK}
                as={as ?? 'a'}
                to={href}
                href={as ? undefined : href}
                target={target}
                ref={refs.setReference}
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  // Close the mobile nav when item is clicked and its not trigger for next menu
                  if (!isL2Trigger) {
                    closeMobileNav?.();
                  }

                  if (isActive) {
                    onLinkActiveChange?.({
                      level: currentLevel,
                      title,
                      isActive: Boolean(isActive),
                      isL2Trigger,
                      isFirstRender: false,
                    });
                  }

                  onClick?.(e);
                }}
                onFocus={(e: { target: HTMLDivElement }) => {
                  // FloatinFocusManager by default focusses on last clicked element when you move to different tab and come back to the original tab
                  // Which can make L1 to expand when tabs / windows are changed
                  // Adding focus-visible check ensures this behaviour of closing menus is only applicable when there is visible focus ring on it (while tabbing)
                  const hasFocusRing = e.target?.matches(':focus-visible');
                  if (isL1Collapsed && currentLevel === 1 && hasFocusRing) {
                    setIsL1Collapsed?.(false);
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
                data-level={currentLevel}
                data-l2trigger={isL2Trigger}
                {...makeAnalyticsAttribute(rest)}
              >
                <NavLinkIconTitle
                  icon={icon}
                  title={title}
                  description={description}
                  isActive={isActive}
                  isL1Item={currentLevel === 1}
                  titleSuffix={titleSuffix}
                />
                {isL2Trigger ? (
                  <BaseBox className={HIDE_WHEN_COLLAPSED} display="flex" alignItems="center">
                    <ChevronRightIcon size="medium" color="currentColor" />
                  </BaseBox>
                ) : null}
              </BaseBox>
            </TooltipifyComponent>
            {trailing && !isL2Trigger ? (
              <BaseBox
                position="absolute"
                top="spacing.0"
                right="spacing.2"
                height="100%"
                display="flex"
                alignItems="center"
                className={`${HIDE_WHEN_COLLAPSED} ${SHOW_ON_LINK_HOVER}`}
              >
                {trailing}
              </BaseBox>
            ) : null}
            {currentLevel === 3 && isActive ? <CurvedVerticalLine /> : null}
          </StyledNavLinkContainer>
          {children ? (
            <FloatingPortal root={l2PortalContainerRef}>
              {isActive && isL1Collapsed ? (
                <FloatingFocusManager modal={false} context={context} initialFocus={-1} returnFocus>
                  <BaseBox ref={refs.setFloating}>{children}</BaseBox>
                </FloatingFocusManager>
              ) : null}
            </FloatingPortal>
          ) : null}
        </>
      )}
    </NavLinkContext.Provider>
  );
};

export { SideNavLink };
