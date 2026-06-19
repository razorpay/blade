import React from 'react';
import { AppBarContext, useAppBarContext } from './AppBarContext';
import type { AppBarActionsProps, AppBarLeadingProps, AppBarProps } from './types';
import {
  APP_BAR_ACTIONS_GAP,
  APP_BAR_BACKGROUND_COLOR,
  APP_BAR_HEIGHT,
  APP_BAR_LEADING_GAP,
  APP_BAR_PADDING_X,
  APP_BAR_PADDING_Y,
} from './appBarTokens';
import type { BladeElementRef } from '~utils/types';
import { makeSize } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { componentZIndices } from '~utils/componentZIndices';
import { getStyledProps } from '~components/Box/styledProps';
import { BladeProvider, useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { IconButton } from '~components/Button/IconButton';
import { ArrowLeftIcon, ShieldIcon } from '~components/Icons';
import { Tooltip } from '~components/Tooltip';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _AppBar = (
  {
    children,
    backButton,
    variant = 'neutral',
    isSticky = true,
    accessibilityLabel,
    backgroundColor,
    position,
    top,
    zIndex,
    width,
    paddingX,
    paddingY,
    testID,
    ...rest
  }: AppBarProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { colorScheme, themeTokens } = useTheme();
  const resolvedBackgroundColor = backgroundColor ?? APP_BAR_BACKGROUND_COLOR[variant];
  const resolvedColorScheme = variant === 'neutral' ? 'dark' : colorScheme;

  const backButtonElement = backButton ? (
    <IconButton
      icon={ArrowLeftIcon}
      size="medium"
      accessibilityLabel={backButton.accessibilityLabel}
      onClick={backButton.onClick}
    />
  ) : null;

  const appBar = (
    <BaseBox
      ref={ref as never}
      display="grid"
      gridTemplateColumns="minmax(0, 1fr) auto"
      alignItems="center"
      columnGap={APP_BAR_ACTIONS_GAP}
      position={position ?? (isSticky ? 'sticky' : 'relative')}
      top={top ?? (isSticky ? '0px' : undefined)}
      width={width ?? '100%'}
      height={makeSize(APP_BAR_HEIGHT)}
      paddingX={paddingX ?? APP_BAR_PADDING_X}
      paddingY={paddingY ?? APP_BAR_PADDING_Y}
      zIndex={zIndex ?? componentZIndices.topnav}
      backgroundColor={resolvedBackgroundColor}
      {...metaAttribute({ name: MetaConstants.AppBar, testID })}
      {...makeAccessible({ role: 'banner', label: accessibilityLabel })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox display="flex" flexDirection="row" alignItems="center" gap={APP_BAR_LEADING_GAP}>
        {backButtonElement && backButton?.tooltip ? (
          <Tooltip content={backButton.tooltip.content} placement={backButton.tooltip.placement}>
            {backButtonElement}
          </Tooltip>
        ) : (
          backButtonElement
        )}
        {children}
      </BaseBox>
    </BaseBox>
  );

  return (
    <AppBarContext.Provider value={{ colorScheme, themeTokens, variant }}>
      {/* AppBar forces a fixed color scheme for the surface so foreground tokens (text/icons)
       contrast against the static-black surface. Children inherit the same theme. */}
      <BladeProvider themeTokens={themeTokens} colorScheme={resolvedColorScheme}>
        {appBar}
      </BladeProvider>
    </AppBarContext.Provider>
  );
};

/**
 * ### AppBar
 *
 * Top-of-screen application/page header for mobile and compact desktop surfaces.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
 * <AppBar backButton={{ onClick: goBack, accessibilityLabel: 'Go back' }}>
 *   <AppBarLeading title="Mavenshop" logo={<MerchantLogo />} isTrustedBusiness />
 *   <AppBarActions>
 *     <IconButton icon={UserIcon} accessibilityLabel="Profile" onClick={openProfile} />
 *   </AppBarActions>
 * </AppBar>
 * ```
 */
const AppBar = assignWithoutSideEffects(React.forwardRef(_AppBar), {
  componentId: MetaConstants.AppBar,
});

const RTBBadge = (): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap="spacing.2"
      paddingX="spacing.3"
      paddingY="spacing.1"
      borderRadius="large"
      backgroundColor="interactive.background.staticWhite.faded"
      flexShrink={0}
    >
      {/* Blade icons are aria-hidden by default, so the shield is decorative and the visible
       "Razorpay Trusted Business" text is what gets announced to screen readers. */}
      <ShieldIcon size="small" color="surface.icon.staticWhite.normal" />
      <Text size="xsmall" weight="regular" color="surface.text.staticWhite.normal">
        Razorpay Trusted Business
      </Text>
    </BaseBox>
  );
};

const _AppBarLeading = ({
  title,
  subtitle,
  logo,
  prefix,
  isTrustedBusiness = false,
  titleSuffix,
  testID,
  ...rest
}: AppBarLeadingProps): React.ReactElement => {
  const appBarContext = useAppBarContext();
  const isNeutral = (appBarContext?.variant ?? 'neutral') === 'neutral';
  // On the dark `neutral` surface the foreground is static-white; on the `subtle`
  // surface it follows the regular theme text tokens so it stays legible.
  const titleColor = isNeutral ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal';
  const subtitleColor = isNeutral ? 'surface.text.staticWhite.muted' : 'surface.text.gray.muted';

  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={APP_BAR_LEADING_GAP}
      minWidth="0px"
      {...metaAttribute({ name: MetaConstants.AppBarLeading, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      {prefix ? (
        <BaseBox display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
          {prefix}
        </BaseBox>
      ) : null}
      {logo ? (
        <BaseBox display="flex" alignItems="center" flexShrink={0}>
          {logo}
        </BaseBox>
      ) : null}
      {title || subtitle ? (
        <BaseBox display="flex" flexDirection="column" minWidth="0px">
          {title ? (
            <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
              <Text size="large" weight="semibold" color={titleColor} truncateAfterLines={1}>
                {title}
              </Text>
              {titleSuffix ? (
                <BaseBox display="flex" alignItems="center" flexShrink={0}>
                  {titleSuffix}
                </BaseBox>
              ) : null}
            </BaseBox>
          ) : null}
          {subtitle ? (
            <Text size="small" weight="regular" color={subtitleColor}>
              {subtitle}
            </Text>
          ) : null}
        </BaseBox>
      ) : null}
      {isTrustedBusiness ? <RTBBadge /> : null}
    </BaseBox>
  );
};

const AppBarLeading = assignWithoutSideEffects(_AppBarLeading, {
  componentId: MetaConstants.AppBarLeading,
});

const _AppBarActions = ({ children, testID, ...rest }: AppBarActionsProps): React.ReactElement => {
  const appBarContext = useAppBarContext();
  const { colorScheme, themeTokens } = useTheme();

  const actions = (
    <BaseBox
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={APP_BAR_ACTIONS_GAP}
      flexShrink={0}
      marginLeft="auto"
      {...metaAttribute({ name: MetaConstants.AppBarActions, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </BaseBox>
  );

  if (appBarContext) {
    return (
      <BladeProvider
        themeTokens={appBarContext.themeTokens}
        colorScheme={appBarContext.variant === 'neutral' ? 'dark' : appBarContext.colorScheme}
      >
        {actions}
      </BladeProvider>
    );
  }

  return (
    <BladeProvider themeTokens={themeTokens} colorScheme={colorScheme}>
      {actions}
    </BladeProvider>
  );
};

const AppBarActions = assignWithoutSideEffects(_AppBarActions, {
  componentId: MetaConstants.AppBarActions,
});

export { AppBar, AppBarLeading, AppBarActions };
