import type { ReactChild, ReactElement } from 'react';
import { Fragment, useState } from 'react';

import { StyledAlert } from './StyledAlert';
import {
  AlertOctagonIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoIcon,
} from '~components/Icons';
import { castNativeType, castWebType, useBreakpoint, getPlatformType } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { IconButton } from '~components/Button/IconButton';
import BaseBox from '~components/Box/BaseBox';
import { Heading, Text } from '~components/Typography';
import BaseButton from '~components/Button/BaseButton';
import { BaseLink } from '~components/Link/BaseLink';
import type { ColorContrastTypes, Feedback } from '~tokens/theme/theme';
import { useTheme } from '~components/BladeProvider';
import type { DotNotationSpacingStringToken, TestID } from '~utils/types';
import { makeAccessible } from '~utils/makeAccessible';
import { throwBladeError } from '~utils/logger';

type Nullable<Type> = Type | null;

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
   * Can be set to `high` for a more prominent look. Not to be confused with a11y contrast.
   *
   * @default low
   */
  contrast?: ColorContrastTypes;

  /**
   * Makes the Alert span the entire container width, instead of the default max width of `584px`.
   * This also makes the alert borderless, useful for creating full bleed layouts.
   *
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Sets the color tone
   *
   * @default neutral
   */
  intent?: Feedback;

  /**
   * Renders a primary action button and a secondary action link button
   */
  actions?: {
    /**
     * Renders a button (should **always** be present if `secondary` action is being used)
     */
    primary: PrimaryAction;

    /**
     * Renders a Link button
     */
    secondary?: SecondaryAction;
  };
} & TestID &
  StyledPropsBlade;

const isReactNative = getPlatformType() === 'react-native';

// Need extra wrappers on React Native only for alignment
const CloseButtonWrapper = isReactNative ? BaseBox : Fragment;

const intentIconMap = {
  positive: CheckCircleIcon,
  negative: AlertOctagonIcon,
  information: InfoIcon,
  neutral: InfoIcon,
  notice: AlertTriangleIcon,
};

const Alert = ({
  description,
  title,
  isDismissible = true,
  onDismiss,
  contrast = 'low',
  isFullWidth = false,
  intent = 'neutral',
  actions,
  testID,
  ...styledProps
}: AlertProps): ReactElement | null => {
  if (__DEV__) {
    if (!actions?.primary && actions?.secondary) {
      throwBladeError({
        message: 'SecondaryAction is allowed only when PrimaryAction is defined.',
        moduleName: 'Alert',
      });
    }
  }
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isDesktop = matchedDeviceType === 'desktop';
  const isMobile = !isDesktop;

  const [isVisible, setIsVisible] = useState(true);
  const contrastType = `${contrast}Contrast` as const;
  const iconSize = isFullWidth ? 'large' : 'medium';
  const textSize = isFullWidth ? 'medium' : 'small';

  const Icon = intentIconMap[intent];
  let iconOffset: DotNotationSpacingStringToken = 'spacing.1';

  // certain special cases below needs special care for near perfect alignment
  if (isReactNative) {
    if (isFullWidth && !title) {
      iconOffset = 'spacing.1';
    } else if (!isFullWidth && !title) {
      iconOffset = 'spacing.0';
    } else if (!isFullWidth && title) {
      iconOffset = 'spacing.2';
    }
  } else if (isMobile) {
    if (!isFullWidth && title) {
      iconOffset = 'spacing.2';
    } else if (isFullWidth && !title) {
      iconOffset = 'spacing.2';
    }
  } else if (isFullWidth) {
    iconOffset = 'spacing.0';
  }

  const icon = (
    <BaseBox marginTop={iconOffset} display="flex">
      <Icon color={`feedback.icon.${intent}.${contrastType}`} size={iconSize} />
    </BaseBox>
  );

  const _title = title ? (
    <BaseBox marginBottom="spacing.2">
      {isFullWidth ? (
        <Heading type="subtle" size="small" contrast={contrast}>
          {title}
        </Heading>
      ) : (
        <Text type="subtle" weight="bold" contrast={contrast}>
          {title}
        </Text>
      )}
    </BaseBox>
  ) : null;

  const _description = (
    <BaseBox marginTop={title || isReactNative ? 'spacing.0' : 'spacing.1'}>
      <Text type="subtle" size={textSize} contrast={contrast}>
        {description}
      </Text>
    </BaseBox>
  );

  const primaryAction = actions?.primary ? (
    <BaseBox
      marginRight="spacing.5"
      display={isReactNative ? castNativeType('flex') : castWebType('inline-flex')}
    >
      <BaseButton
        size={textSize}
        onClick={actions.primary.onClick}
        intent={intent}
        contrast={contrast}
      >
        {actions.primary.text}
      </BaseButton>
    </BaseBox>
  ) : null;

  const secondaryActionParams: Nullable<Partial<SecondaryActionLinkButton>> = actions?.secondary
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
      marginRight="spacing.4"
      display={isReactNative ? castNativeType('flex') : castWebType('inline-flex')}
    >
      <BaseLink size={textSize} contrast={contrast} intent={intent} {...secondaryActionParams}>
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
        contrast={contrast}
        size={iconSize}
        icon={CloseIcon}
      />
    </CloseButtonWrapper>
  ) : null;

  const a11yProps = makeAccessible({
    // React Native doesn't has status as role
    role: isReactNative || intent === 'negative' || intent === 'notice' ? 'alert' : 'status',
    // override the implicit live region of role `alert`
    ...(intent === 'notice' && { liveRegion: 'polite' }),
  });

  if (!isVisible) {
    return null;
  }

  return (
    <BaseBox
      {...a11yProps}
      {...metaAttribute({ name: MetaConstants.Alert, testID })}
      {...getStyledProps(styledProps)}
    >
      <StyledAlert
        intent={intent}
        contrastType={contrastType}
        isFullWidth={isFullWidth}
        isDesktop={isDesktop}
        textAlign={'left' as never}
      >
        {icon}
        <BaseBox
          flex={1}
          paddingLeft={isFullWidth ? 'spacing.4' : 'spacing.3'}
          paddingRight={showActionsHorizontal ? 'spacing.4' : 'spacing.2'}
        >
          {_title}
          {_description}
          {actionsVertical}
        </BaseBox>
        {actionsHorizontal}
        {closeButton}
      </StyledAlert>
    </BaseBox>
  );
};

export { AlertProps, Alert };
