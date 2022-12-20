/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Divider } from './Divider';
import { useVerifyInsideCard } from './CardContext';
import Box from '~components/Box';
import type { TextProps, TextVariant } from '~components/Typography';
import { Heading, Text } from '~components/Typography';
import type { IconComponent } from '~components/Icons';
import type { CounterProps } from '~components/Counter';
import { Counter } from '~components/Counter';
import type { BadgeProps } from '~components/Badge';
import { Badge } from '~components/Badge';
import type { LinkProps } from '~components/Link';
import { Link } from '~components/Link';
import type { ButtonProps } from '~components/Button';
import { Button } from '~components/Button';
import { minHeight } from '~components/Button/BaseButton/buttonTokens';
import type { WithComponentId } from '~utils';
import {
  metaAttribute,
  MetaConstants,
  getComponentId,
  isValidAllowedChildren,
  makeSpace,
} from '~utils';

const ComponentIds = {
  CardHeaderIcon: 'CardHeaderIcon',
  CardHeaderCounter: 'CardHeaderCounter',
  CardHeaderBadge: 'CardHeaderBadge',
  CardHeaderText: 'CardHeaderText',
  CardHeaderLink: 'CardHeaderLink',
  CardHeaderIconButton: 'CardHeaderIconButton',
};

const CardHeaderIcon: WithComponentId<{ icon: IconComponent }> = ({ icon: Icon }) => {
  useVerifyInsideCard('CardHeaderIcon');

  return <Icon color="surface.text.normal.lowContrast" size="xlarge" />;
};
CardHeaderIcon.componentId = ComponentIds.CardHeaderIcon;

const CardHeaderCounter: WithComponentId<CounterProps> = (props) => {
  useVerifyInsideCard('CardHeaderCounter');

  return <Counter {...props} />;
};
CardHeaderCounter.componentId = ComponentIds.CardHeaderCounter;

const CardHeaderBadge: WithComponentId<BadgeProps> = (props) => {
  useVerifyInsideCard('CardHeaderBadge');

  return <Badge {...props} />;
};
CardHeaderBadge.componentId = ComponentIds.CardHeaderBadge;

const CardHeaderText: WithComponentId<TextProps<{ variant: TextVariant }>> = (props) => {
  useVerifyInsideCard('CardHeaderText');

  return <Text {...props} />;
};
CardHeaderText.componentId = ComponentIds.CardHeaderText;

const CardHeaderLink: WithComponentId<LinkProps> = (props) => {
  useVerifyInsideCard('CardHeaderLink');

  return <Link {...props} />;
};
CardHeaderLink.componentId = ComponentIds.CardHeaderLink;

type CardHeaderIconButtonProps = Omit<
  ButtonProps,
  'variant' | 'size' | 'iconPosition' | 'isFullWidth' | 'children'
> & {
  icon: IconComponent;
};

const CardHeaderIconButton: WithComponentId<CardHeaderIconButtonProps> = (props) => {
  useVerifyInsideCard('CardHeaderIconButton');

  return (
    <Box width={makeSpace(minHeight.xsmall)}>
      <Button {...props} variant="tertiary" size="xsmall" iconPosition="left" isFullWidth />
    </Box>
  );
};
CardHeaderIconButton.componentId = ComponentIds.CardHeaderIconButton;

type CardHeaderProps = {
  children?: React.ReactNode;
};

const CardHeader = ({ children }: CardHeaderProps): React.ReactElement => {
  useVerifyInsideCard('CardHeader');

  return (
    <Box
      marginBottom="spacing.7"
      {...metaAttribute(MetaConstants.Component, MetaConstants.CardHeader)}
    >
      <Box
        marginBottom="spacing.7"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        {children}
      </Box>
      <Divider />
    </Box>
  );
};

type CardHeaderLeadingProps = {
  title: string;
  subtitle?: string;
  /**
   * prefix element of Card
   *
   * Accepts: `CardHeaderIcon` component
   */
  prefix?: React.ReactNode;
  /**
   * suffix element of Card
   *
   * Accepts: `CardHeaderCounter` component
   */
  suffix?: React.ReactNode;
};
const CardHeaderLeading = ({
  title,
  subtitle,
  prefix,
  suffix,
}: CardHeaderLeadingProps): React.ReactElement => {
  useVerifyInsideCard('CardHeaderLeading');

  if (prefix && !isValidAllowedChildren(prefix, ComponentIds.CardHeaderIcon)) {
    throw new Error(
      `[Blade CardHeaderLeading]: Only \`${ComponentIds.CardHeaderIcon}\` component is accepted in prefix`,
    );
  }

  if (suffix && !isValidAllowedChildren(suffix, ComponentIds.CardHeaderCounter)) {
    throw new Error(
      `[Blade CardHeaderLeading]: Only \`${ComponentIds.CardHeaderCounter}\` component is accepted in prefix`,
    );
  }

  return (
    <Box flex={1} display="flex" flexDirection="row">
      <Box marginRight="spacing.3" alignSelf="center" display="flex">
        {prefix}
      </Box>
      <Box>
        <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap">
          <Heading size="small" variant="regular" type="normal">
            {title}
          </Heading>
          <Box marginLeft="spacing.3">{suffix}</Box>
        </Box>
        <Text variant="body" size="small" weight="regular">
          {subtitle}
        </Text>
      </Box>
    </Box>
  );
};

type CardHeaderTrailingProps = {
  /**
   * Renders a visual ornament in card header trailing section
   *
   * Accepts: `CardHeaderLink`, `CardHeaderText`, `CardHeaderIconButton`, `CardHeaderBadge`
   */
  visual?: React.ReactNode;
};

const headerTrailingAllowedComponents = [
  ComponentIds.CardHeaderLink,
  ComponentIds.CardHeaderText,
  ComponentIds.CardHeaderIconButton,
  ComponentIds.CardHeaderBadge,
];

const CardHeaderTrailing = ({ visual }: CardHeaderTrailingProps): React.ReactElement => {
  useVerifyInsideCard('CardHeaderTrailing');

  if (visual && !headerTrailingAllowedComponents.includes(getComponentId(visual)!)) {
    throw new Error(
      `[Blade CardHeaderTrailing]: Only one of \`${headerTrailingAllowedComponents.join(
        ', ',
      )}\` component is accepted in visual`,
    );
  }

  return <Box alignSelf="center">{visual}</Box>;
};

export {
  CardHeader,
  CardHeaderLeading,
  CardHeaderTrailing,
  CardHeaderBadge,
  CardHeaderIcon,
  CardHeaderCounter,
  CardHeaderText,
  CardHeaderLink,
  CardHeaderIconButton,
};
