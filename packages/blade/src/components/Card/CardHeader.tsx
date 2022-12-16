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
import { makeSpace } from '~utils';

const ComponentIds = {
  CardHeaderIcon: 'CardHeaderIcon',
  CardHeaderCounter: 'CardHeaderCounter',
  CardHeaderBadge: 'CardHeaderBadge',
  CardHeaderText: 'CardHeaderText',
  CardHeaderLink: 'CardHeaderLink',
  CardHeaderIconButton: 'CardHeaderIconButton',
};

const CardHeaderIcon = ({ icon: Icon }: { icon: IconComponent }): React.ReactElement => {
  useVerifyInsideCard('CardHeaderIcon');

  return <Icon color="surface.text.normal.lowContrast" size="xlarge" />;
};
CardHeaderIcon.componentId = ComponentIds.CardHeaderIcon;

const CardHeaderCounter = (props: CounterProps): React.ReactElement => {
  useVerifyInsideCard('CardHeaderCounter');

  return <Counter {...props} />;
};
CardHeaderCounter.componentId = ComponentIds.CardHeaderCounter;

const CardHeaderBadge = (props: BadgeProps): React.ReactElement => {
  useVerifyInsideCard('CardHeaderBadge');

  return <Badge {...props} />;
};
CardHeaderBadge.componentId = ComponentIds.CardHeaderBadge;

const CardHeaderText = (props: TextProps<{ variant: TextVariant }>): React.ReactElement => {
  useVerifyInsideCard('CardHeaderText');

  return <Text {...props} />;
};
CardHeaderText.componentId = ComponentIds.CardHeaderText;

const CardHeaderLink = (props: LinkProps): React.ReactElement => {
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

const CardHeaderIconButton = (props: CardHeaderIconButtonProps): React.ReactElement => {
  useVerifyInsideCard('CardHeaderIconButton');

  return (
    <Box width={makeSpace(minHeight.xsmall)}>
      <Button {...props} variant="tertiary" size="xsmall" iconPosition="left" isFullWidth />
    </Box>
  );
};
CardHeaderIconButton.componentId = ComponentIds.CardHeaderIconButton;

const getComponentId = (component: React.ReactNode): string | null => {
  if (!React.isValidElement(component)) return null;
  return (component.type as any)?.componentId;
};

const isValidAllowedChildren = (component: React.ReactNode, id: string): boolean => {
  return getComponentId(component) === id;
};

type CardHeaderProps = {
  children?: React.ReactNode;
};

const CardHeader = ({ children }: CardHeaderProps): React.ReactElement => {
  useVerifyInsideCard('CardHeader');

  return (
    <Box marginBottom="spacing.7">
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
  prefix?: React.ReactNode;
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
