import type { ReactChild, ReactElement, ReactNode } from 'react';
import { Fragment, useState } from 'react';

import StyledAlert from './StyledAlert';
import { AlertIcon, CloseIcon } from '~components/Icons';
import { getPlatformType, makeAccessible } from '~utils';
import { IconButton } from '~components/Button/IconButton';
import Box from '~components/Box';
import { Heading, Text } from '~components/Typography';
import BaseButton from '~components/Button/BaseButton';
import { BaseLink } from '~components/Link/BaseLink';
import type { ColorContrastTypes } from '~tokens/theme/theme';

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

export type AlertProps = {
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
  isDismissable?: boolean;

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
   * Makes the Alert span the entire container width, instead of the default max width of `584px`
   *
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Sets the color tone
   *
   * @default information
   */
  intent?: 'positive' | 'negative' | 'information' | 'notice';

  /**
   * Removes border and border radii, useful for creating full bleed layouts. Automatically sets `isFullWidth` to `true` when enabled.
   *
   * @default false
   */
  isBorderless?: boolean;

  /**
   * Renders a primary action button and a secondary action link button
   */
  actions?: {
    /**
     * Renders a button
     */
    primary?: PrimaryAction;

    /**
     * Renders a Link button
     */
    secondary?: SecondaryAction;
  };
};

const isReactNative = getPlatformType() === 'react-native';

// Need extra wrappers on React Native only for alignment
const SecondaryActionWrapper = isReactNative ? Box : Fragment;
const CloseButtonWrapper = isReactNative ? Box : Fragment;

// todo: add all icons
const intentIconMap = {
  positive: AlertIcon,
  negative: AlertIcon,
  information: AlertIcon,
  notice: AlertIcon,
};

const Alert = ({
  description,
  title,
  isDismissable = true,
  onDismiss,
  contrast = 'low',
  isFullWidth = false,
  intent = 'information',
  isBorderless = false,
  actions,
}: AlertProps): ReactElement | null => {
  const [isVisible, setIsVisible] = useState(true);
  const contrastType = `${contrast}Contrast` as const;

  const Icon = intentIconMap[intent];
  const icon = <Icon color={`feedback.icon.${intent}.${contrastType}`} size="large" />;

  const _title = title ? (
    <Box marginBottom="spacing.1">
      <Heading variant="small" contrast={contrast}>
        {title}
      </Heading>
    </Box>
  ) : null;

  const _description = <Text contrast={contrast}>{description}</Text>;

  const primaryAction = actions?.primary ? (
    <Box marginRight="spacing.4" display={isReactNative ? 'flex' : 'inline-flex'}>
      <BaseButton onClick={actions.primary.onClick} intent={intent} contrast={contrast}>
        {actions.primary.text}
      </BaseButton>
    </Box>
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
    <SecondaryActionWrapper>
      <BaseLink contrast={contrast} intent={intent} {...secondaryActionParams}>
        {actions.secondary.text}
      </BaseLink>
    </SecondaryActionWrapper>
  ) : null;

  const _actions =
    primaryAction || secondaryAction ? (
      <Box marginTop="spacing.3" flexDirection="row" alignItems="center">
        {primaryAction}
        {secondaryAction}
      </Box>
    ) : null;

  const onClickDismiss = (): void => {
    if (onDismiss) {
      onDismiss();
    }
    setIsVisible(false);
  };
  const closeButton = isDismissable ? (
    <CloseButtonWrapper>
      <IconButton
        accessibilityLabel="Dismiss alert"
        onClick={onClickDismiss}
        contrast={contrast}
        size="large"
        icon={CloseIcon}
      />
    </CloseButtonWrapper>
  ) : null;

  const a11yProps = makeAccessible({
    role: intent === 'negative' || intent === 'notice' ? 'alert' : 'status',
    // override the implicit live region of role `alert`
    ...(intent === 'notice' && { liveRegion: 'polite' }),
  });

  if (!isVisible) {
    return null;
  }

  return (
    <StyledAlert
      intent={intent}
      contrastType={contrastType}
      isFullWidth={isFullWidth}
      isBorderless={isBorderless}
      {...a11yProps}
    >
      {icon}
      <Box flex={1} paddingLeft="spacing.3" paddingRight="spacing.3">
        {_title}
        {_description}
        {_actions}
      </Box>
      {closeButton}
    </StyledAlert>
  );
};

export default Alert;
