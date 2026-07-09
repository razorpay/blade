import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { drawerComponentIds } from './drawerComponentIds';
import { DrawerContext } from './DrawerContext';
import type { DrawerHeaderProps, DrawerFooterProps } from './types';
import { useDrawerStack } from './StackProvider';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import { Box } from '~components/Box';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useTheme } from '~utils';

/**
 * Replicates the web DrawerHeader's radial-gradient background on native.
 *
 * Web uses a CSS `radial-gradient(150% 100% at 50% 100%, transparent 0%, subtle 100%)`
 * driven by the `color` prop. React Native has no CSS radial-gradient, so we draw an
 * equivalent gradient with react-native-svg using the same status-driven feedback token.
 */
const DrawerHeaderGradient = ({
  color,
}: {
  color: NonNullable<DrawerHeaderProps['color']>;
}): React.ReactElement => {
  const { theme } = useTheme();
  // Web's `feedback.background[color].subtle` token is a low-opacity hsla() (e.g. 0.18 alpha).
  // Web applies it as the far stop of a radial-gradient that fades from `transparent`, so the
  // visible tint never exceeds that alpha (hence it looks very light). react-native-svg's <Stop>
  // does not honor the alpha channel embedded in a color string, so we split the token into its
  // opaque hue + explicit `stopOpacity` to reproduce web's light tint exactly (no magic values).
  const subtleColor = theme.colors.feedback.background[color].subtle;
  const alphaMatch = subtleColor.match(/hsla?\([^)]*,\s*([\d.]+)\s*\)$/);
  const subtleAlpha = alphaMatch ? Number(alphaMatch[1]) : 1;
  const opaqueColor = subtleColor.replace(/^hsla/, 'hsl').replace(/,\s*[\d.]+\s*\)$/, ')');
  const gradientId = `drawer-header-gradient-${color}`;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id={gradientId} cx="50%" cy="100%" rx="150%" ry="100%">
            <Stop offset="0" stopColor={opaqueColor} stopOpacity={0} />
            <Stop offset="1" stopColor={opaqueColor} stopOpacity={subtleAlpha} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
      </Svg>
    </View>
  );
};

const _DrawerHeader = ({
  title,
  subtitle,
  leading,
  trailing,
  titleSuffix,
  children,
  // `color` drives the radial-gradient background on web. Native has no CSS
  // radial-gradient, so we replicate it with an equivalent react-native-svg gradient
  // (see DrawerHeaderGradient) using the same status-driven feedback token.
  color = 'information',
  showDivider = true,
  ...rest
}: DrawerHeaderProps): React.ReactElement => {
  const { close, closeButtonRef, stackingLevel, isExiting } = React.useContext(DrawerContext);
  const { drawerStack } = useDrawerStack();

  const closeAllDrawers = (): void => {
    for (const onDismiss of Object.values(drawerStack)) {
      onDismiss();
    }
  };

  const isStackedDrawer = stackingLevel && stackingLevel > 1;

  const isAtleastOneDrawerOpen = Object.keys(drawerStack).length > 0;

  // This condition is to avoid back button disappear while stacked drawer is in the exiting transition
  const isDrawerExiting = isAtleastOneDrawerOpen && isExiting && stackingLevel !== 1;

  return (
    <Box position="relative">
      <DrawerHeaderGradient color={color} />
      <BaseHeader
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        showBackButton={isStackedDrawer || isDrawerExiting}
        showCloseButton={true}
        closeButtonRef={closeButtonRef}
        onCloseButtonClick={() => closeAllDrawers()}
        onBackButtonClick={() => close()}
        title={title}
        size="xlarge"
        titleSuffix={titleSuffix}
        subtitle={subtitle}
        leading={leading}
        trailing={trailing}
        showDivider={showDivider}
        {...makeAnalyticsAttribute(rest)}
      >
        {children}
      </BaseHeader>
    </Box>
  );
};

/**
 * #### Usage
 *
 * ```jsx
 * <DrawerHeader
 *  title="Announcements"
 *  subtitle="Checkout what's new in Razorpay"
 *  titleSuffix={<DrawerHeaderBadge>New</DrawerHeaderBadge>}
 *  leading={<DrawerHeaderIcon icon={AnnouncementIcon} />}
 *  trailing={<Button icon={DownloadIcon} />}
 * />
 * ```
 *
 */
const DrawerHeader = assignWithoutSideEffects(_DrawerHeader, {
  componentId: drawerComponentIds.DrawerHeader,
});

const drawerPadding = 'spacing.6';

const _DrawerBody = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Box flex="1">
      <ScrollView>
        <Box padding={drawerPadding}>{children}</Box>
      </ScrollView>
    </Box>
  );
};
const DrawerBody = assignWithoutSideEffects(_DrawerBody, {
  componentId: drawerComponentIds.DrawerBody,
});

const _DrawerFooter = ({
  children,
  showDivider = true,
  ...rest
}: DrawerFooterProps): React.ReactElement => {
  // Web uses position:'sticky'; native has no sticky positioning, so the footer
  // renders at the end of the column flex container instead.
  return (
    <Box {...makeAnalyticsAttribute(rest)}>
      <BaseFooter showDivider={showDivider}>{children}</BaseFooter>
    </Box>
  );
};

/**
 * #### Usage
 *
 * ```jsx
 * <DrawerFooter>
 *   <Button variant="primary" isFullWidth>
 *     Continue
 *   </Button>
 * </DrawerFooter>
 * ```
 *
 */
const DrawerFooter = assignWithoutSideEffects(_DrawerFooter, {
  componentId: drawerComponentIds.DrawerFooter,
});

export { DrawerHeader, DrawerBody, DrawerFooter, drawerPadding };
