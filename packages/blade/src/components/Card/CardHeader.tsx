/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Divider } from './Divider';
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

type CardHeaderProps = {
  children?: React.ReactNode;
};

const Components = {
  CardHeaderIcon: 'CardHeaderIcon',
  CardHeaderCounter: 'CardHeaderCounter',
  CardHeaderBadge: 'CardHeaderBadge',
  CardHeaderText: 'CardHeaderText',
  CardHeaderLink: 'CardHeaderLink',
  CardHeaderIconButton: 'CardHeaderIconButton',
};

const CardHeaderIcon = ({ icon: Icon }: { icon: IconComponent }): React.ReactElement => {
  return <Icon color="surface.text.normal.lowContrast" size="xlarge" />;
};
CardHeaderIcon.componentId = Components.CardHeaderIcon;

const CardHeaderCounter = (props: CounterProps): React.ReactElement => {
  return <Counter {...props} />;
};
CardHeaderCounter.componentId = Components.CardHeaderCounter;

const CardHeaderBadge = (props: BadgeProps): React.ReactElement => {
  return <Badge {...props} />;
};
CardHeaderBadge.componentId = Components.CardHeaderBadge;

const CardHeaderText = (props: TextProps<{ variant: TextVariant }>): React.ReactElement => {
  return <Text {...props} />;
};
CardHeaderText.componentId = Components.CardHeaderText;

const CardHeaderLink = (props: LinkProps): React.ReactElement => {
  return <Link {...props} />;
};
CardHeaderLink.componentId = Components.CardHeaderLink;

type CardHeaderIconButtonProps = Omit<
  ButtonProps,
  'variant' | 'size' | 'iconPosition' | 'isFullWidth' | 'children'
> & {
  icon: IconComponent;
};

const CardHeaderIconButton = (props: CardHeaderIconButtonProps): React.ReactElement => {
  return (
    <Box width={makeSpace(minHeight.xsmall)}>
      <Button {...props} variant="tertiary" size="xsmall" iconPosition="left" isFullWidth />
    </Box>
  );
};
CardHeaderIconButton.componentId = Components.CardHeaderIconButton;

const isOfComponentId = (comp: React.ReactNode, id: string): boolean => {
  if (!React.isValidElement(comp)) return false;
  return (comp.type as any)?.componentId === id;
};

const getComponentId = (comp: React.ReactNode): string | null => {
  if (!React.isValidElement(comp)) return null;
  return (comp.type as any)?.componentId;
};

const CardHeader = ({ children }: CardHeaderProps): React.ReactElement => {
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
  if (prefix && !isOfComponentId(prefix, Components.CardHeaderIcon)) {
    throw new Error(
      `[Blade CardHeaderLeading]: Only \`${Components.CardHeaderIcon}\` component is accepted in prefix`,
    );
  }

  if (suffix && !isOfComponentId(suffix, Components.CardHeaderCounter)) {
    throw new Error(
      `[Blade CardHeaderLeading]: Only \`${Components.CardHeaderCounter}\` component is accepted in prefix`,
    );
  }

  return (
    <Box display="flex" flexDirection="row">
      <Box marginRight="spacing.3" alignSelf="center" display="flex">
        {prefix}
      </Box>
      <Box>
        <Box display="flex" flexDirection="row" alignItems="center">
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
  Components.CardHeaderLink,
  Components.CardHeaderText,
  Components.CardHeaderIconButton,
  Components.CardHeaderBadge,
];

const CardHeaderTrailing = ({ visual }: CardHeaderTrailingProps): React.ReactElement => {
  if (visual && !headerTrailingAllowedComponents.includes(getComponentId(visual)!)) {
    throw new Error(
      `[Blade CardHeaderTrailing]: Only \`${headerTrailingAllowedComponents.join(
        ', ',
      )}\` component is accepted in suffix`,
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
