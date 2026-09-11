import type { ReactChild, ReactElement } from 'react';
import React, { Fragment, useState, forwardRef } from 'react';

import { StyledAlert } from './StyledAlert';
import type { IconComponent } from '~components/Icons';
import {
  AlertOctagonIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoIcon,
} from '~components/Icons';
import { castNativeType, castWebType, useBreakpoint, getPlatformType, makeSize } from '~utils';
import { size } from '~tokens/global';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BoxProps } from '~components/Box';
import { IconButton } from '~components/Button/IconButton';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import BaseButton from '~components/Button/BaseButton';
import { BaseLink } from '~components/Link/BaseLink';
import type { SubtleOrIntense } from '~tokens/theme/theme';
import type { AlertColors } from './types';
import { getAlertIconColor } from './styles';
import { useTheme } from '~components/BladeProvider';
import type { DataAnalyticsAttribute, BladeElementRef, TestID } from '~utils/types';
import { makeAccessible } from '~utils/makeAccessible';
import { MAKE_ANALYTICS_CONSTANTS, makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type PrimaryAction = {
  text: string;
  onClick: () => void;
};

type SecondaryActionButton = {
  text: string;
  onClick: () => void;
};

type SecondaryActionLinkButton = {
  text: string;
  href: string;
  onClick?: () => void;
  target?: string;
  /**
   * When `target` is set to `_blank` this is automatically set to `noopener noreferrer`
   */
  rel?: string;
};

type SecondaryAction = SecondaryActionButton | SecondaryActionLinkButton;

type AlertProps = {
  /**
   * Body content, pass text or JSX. Avoid passing components except `Link` to customize the content.
   */
  description: ReactChild;

  /**
   * A brief heading
   */
  title?: string;

  /**
   * Shows a dismiss button
   *
   * @default true
   */
  isDismissible?: boolean;

  /**
   * A callback when the dismiss button is clicked
   */
  onDismiss?: () => void;

  /**
   * Can be used to render custom icon
   */
  icon?: IconComponent;

  /**
   * Can be set to `high` for a more prominent look. Not to be confused with a11y emphasis.
   *
   * @default subtle
   */
  emphasis?: SubtleOrIntense;

  /**
   * Makes the Alert span the entire container width, instead of the default max width of `584px`.
   *
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Sets a custom max-width for the Alert.
   * Has no effect when `isFullWidth` is true.
   *
   * @default '584px' (derived from global size token `size[584]`)
   */
  maxWidth?: BoxProps['maxWidth'];

  /**
   * Sets the color tone
   */
  color?: AlertColors;

  /**
   * Renders a primary action button and a secondary action link button
   */
  actions?: {
    /**
     * Renders a button (should **always** be present if `secondary` action is being used)
     */
    primary?: PrimaryAction;
    /**
     * Renders a Link button
     */
    secondary?: SecondaryAction;
  };
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;

const DEFAULT_MAX_WIDTH = makeSize(size[584]);

const isReactNative = getPlatformType() === 'react-native';

// Need extra wrappers on React Native only for alignment
const CloseButtonWrapper = isReactNative ? BaseBox : Fragment;

const intentIconMap = {
  positive: CheckCircleIcon,
  negative: AlertOctagonIcon,
  information: InfoIcon,
  neutral: InfoIcon,
  notice: AlertTriangleIcon,
  primary: InfoIcon,
};

const _Alert = (
  {
    description,
    title,
    isDismissible = true,
    onDismiss,
    emphasis = 'subtle',
    isFullWidth = false,
    maxWidth,
    color = 'neutral',
    actions,
    testID,
    icon,
    ...rest
  }: AlertProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement | null => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const [isVisible, setIsVisible] = useState(true);

  const isDesktop = matchedDeviceType === 'desktop';

  const isDescriptionOnly = !title && !actions?.primary && !actions?.secondary;

  const Icon = icon ?? intentIconMap[color];

  // Anchor the icon to the first line of the adjacent text (title when present, else
  // description) instead of the whole text block, because a block-centered icon drifts
  // once the description wraps to multiple lines. This includes desktop full-width
  // banners with inline actions: their copy is not guaranteed to stay single-line, and
  // the icon + content group in the render below keeps the single-line case row-centered
  // against the action buttons.
  // The wrapper is exactly one line-box tall and the icon centers inside it:
  // title is Text size="medium" (lineHeights[100]), description is Text size="small" (lineHeights[75])
  const firstLineHeight = makeSize(theme.typography.lineHeights[title ? 100 : 75]);

  const leadingIcon = (
    <BaseBox
      display="flex"
      alignSelf="flex-start"
      // center on both axes: web flex defaults to row (alignItems is the vertical axis),
      // React Native defaults to column (justifyContent is the vertical axis)
      alignItems="center"
      justifyContent="center"
      height={firstLineHeight}
      // mirrors _description's own top margin so the two line-boxes coincide
      marginTop={title || isReactNative ? 'spacing.0' : 'spacing.1'}
    >
      <Icon color={getAlertIconColor(color, emphasis)} size="medium" />
    </BaseBox>
  );

  const textColor =
    emphasis === 'intense' ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal';
  const _title = title ? (
    <BaseBox marginBottom="spacing.2">
      <Text color={textColor} size="medium" weight="semibold">
        {title}
      </Text>
    </BaseBox>
  ) : null;

  const descriptionTextColor =
    emphasis === 'intense' ? 'surface.text.staticWhite.subtle' : 'surface.text.gray.subtle';

  const _description = (
    <BaseBox marginTop={title || isReactNative ? 'spacing.0' : 'spacing.1'}>
      <Text color={descriptionTextColor} size="small">
        {description}
      </Text>
    </BaseBox>
  );

  const primaryAction = actions?.primary ? (
    <BaseBox
      marginRight={actions?.secondary || isDismissible ? 'spacing.5' : 'spacing.0'}
      display={isReactNative ? castNativeType('flex') : castWebType('inline-flex')}
    >
      <BaseButton
        size="small"
        onClick={actions.primary.onClick}
        color={emphasis === 'subtle' ? 'primary' : 'white'}
        variant={emphasis === 'subtle' ? 'secondary' : 'primary'}
        data-analytics-name={MAKE_ANALYTICS_CONSTANTS.ALERT.PRIMARY_ACTION_BUTTON}
      >
        {actions.primary.text}
      </BaseButton>
    </BaseBox>
  ) : null;

  const secondaryActionParams: Partial<SecondaryActionLinkButton> | null = actions?.secondary
    ? {
        onClick: actions.secondary.onClick,
      }
    : null;

  /**
   * TS assumes only common properties to be present for `SecondaryAction` union type
   * We add a type guard that checks if href is present on secondary action:
   * - If yes, then TS can assume it to be `SecondaryActionLinkButton` (href being a required property)
   * - If no, then it would be `SecondaryActionButton` (and link properties wouldn't be needed)
   */
  if (actions?.secondary && secondaryActionParams && 'href' in actions.secondary) {
    secondaryActionParams.href = actions.secondary.href;
    secondaryActionParams.target = actions.secondary.target;
    secondaryActionParams.rel = actions.secondary.rel;
  }

  const secondaryAction = actions?.secondary ? (
    <BaseBox
      marginRight={isDismissible ? 'spacing.4' : 'spacing.0'}
      display={(isReactNative ? 'flex' : 'inline-flex') as never}
    >
      <BaseLink
        size="small"
        color={emphasis === 'intense' ? 'white' : 'neutral'}
        {...secondaryActionParams}
      >
        {actions.secondary.text}
      </BaseLink>
    </BaseBox>
  ) : null;

  // For certain cases we wish to render actions inline with text content
  const showActionsHorizontal = isFullWidth && isDesktop;

  const actionsHorizontal =
    showActionsHorizontal && (primaryAction || secondaryAction) ? (
      <BaseBox flexDirection="row" alignItems="center">
        {primaryAction}
        {secondaryAction}
      </BaseBox>
    ) : null;

  const actionsVertical =
    !showActionsHorizontal && (primaryAction || secondaryAction) ? (
      <BaseBox marginTop="spacing.4" flexDirection="row" alignItems="center">
        {primaryAction}
        {secondaryAction}
      </BaseBox>
    ) : null;

  const onClickDismiss = (): void => {
    if (onDismiss) {
      onDismiss();
    }
    setIsVisible(false);
  };
  const closeButton = isDismissible ? (
    <CloseButtonWrapper>
      <IconButton
        accessibilityLabel="Dismiss alert"
        onClick={onClickDismiss}
        emphasis={emphasis === 'intense' ? 'subtle' : 'intense'}
        size="medium"
        icon={CloseIcon}
        marginTop={isDescriptionOnly ? makeSize(2) : 'spacing.0'}
      />
    </CloseButtonWrapper>
  ) : null;

  const a11yProps = makeAccessible({
    // React Native doesn't has status as role
    role: isReactNative || color === 'negative' || color === 'notice' ? 'alert' : 'status',
    // override the implicit live region of role `alert`
    ...(color === 'notice' && { liveRegion: 'polite' }),
  });

  if (!isVisible) {
    return null;
  }

  return (
    <BaseBox
      ref={ref as never}
      {...a11yProps}
      {...metaAttribute({ name: MetaConstants.Alert, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      <StyledAlert
        color={color}
        emphasis={emphasis}
        isFullWidth={isFullWidth}
        isDesktop={isDesktop}
        maxWidth={isFullWidth ? 'auto' : maxWidth ?? DEFAULT_MAX_WIDTH}
        textAlign={'left' as never}
      >
        <BaseBox display="flex" flexDirection="row" alignItems="flex-start" flex={1} minWidth="0px">
          {leadingIcon}
          <BaseBox
            flex={1}
            paddingLeft="spacing.3"
            paddingRight={showActionsHorizontal ? 'spacing.4' : 'spacing.2'}
          >
            {_title}
            {_description}
            {actionsVertical}
          </BaseBox>
        </BaseBox>
        {actionsHorizontal}
        {closeButton}
      </StyledAlert>
    </BaseBox>
  );
};

const Alert = forwardRef(_Alert);

export type { AlertProps, AlertColors };
export { Alert };
