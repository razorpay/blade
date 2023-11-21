/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useVerifyInsideCard } from './CardContext';
import { ComponentIds } from './Card';
import type { BadgeProps } from '~components/Badge';
import { Badge } from '~components/Badge';
import type { LinkProps } from '~components/Link';
import { Link } from '~components/Link';
import type { ButtonProps } from '~components/Button';
import { Button } from '~components/Button';
import { Counter } from '~components/Counter';
import type { CounterProps } from '~components/Counter';
import { Divider } from '~components/Divider';
import BaseBox from '~components/Box/BaseBox';
import type { TextProps, TextVariant } from '~components/Typography';
import { Heading, Text } from '~components/Typography';
import type { IconComponent } from '~components/Icons';
import { minHeight } from '~components/Button/BaseButton/buttonTokens';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { TestID } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSpace } from '~utils/makeSpace';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren/useVerifyAllowedChildren';

const _CardHeaderIcon = ({ icon: Icon }: { icon: IconComponent }): React.ReactElement => {
  useVerifyInsideCard('CardHeaderIcon');

  return <Icon color="surface.text.normal.lowContrast" size="xlarge" />;
};
const CardHeaderIcon = assignWithoutSideEffects(_CardHeaderIcon, {
  componentId: ComponentIds.CardHeaderIcon,
});

const _CardHeaderCounter = (props: CounterProps): React.ReactElement => {
  useVerifyInsideCard('CardHeaderCounter');

  return <Counter {...props} />;
};
const CardHeaderCounter = assignWithoutSideEffects(_CardHeaderCounter, {
  componentId: ComponentIds.CardHeaderCounter,
});

const _CardHeaderBadge = (props: BadgeProps): React.ReactElement => {
  useVerifyInsideCard('CardHeaderBadge');

  return <Badge {...props} />;
};
const CardHeaderBadge = assignWithoutSideEffects(_CardHeaderBadge, {
  componentId: ComponentIds.CardHeaderBadge,
});

const _CardHeaderText = (props: TextProps<{ variant: TextVariant }>): React.ReactElement => {
  useVerifyInsideCard('CardHeaderText');

  return <Text textAlign="left" {...props} />;
};
const CardHeaderText = assignWithoutSideEffects(_CardHeaderText, {
  componentId: ComponentIds.CardHeaderText,
});

const _CardHeaderLink = (props: LinkProps): React.ReactElement => {
  useVerifyInsideCard('CardHeaderLink');

  return <Link {...props} />;
};
const CardHeaderLink = assignWithoutSideEffects(_CardHeaderLink, {
  componentId: ComponentIds.CardHeaderLink,
});

type CardHeaderIconButtonProps = Omit<
  ButtonProps,
  'variant' | 'size' | 'iconPosition' | 'isFullWidth' | 'children'
> & {
  icon: IconComponent;
};

const _CardHeaderIconButton = (props: CardHeaderIconButtonProps): React.ReactElement => {
  useVerifyInsideCard('CardHeaderIconButton');

  return (
    <BaseBox width={makeSpace(minHeight.xsmall)}>
      <Button {...props} variant="tertiary" size="xsmall" iconPosition="left" isFullWidth />
    </BaseBox>
  );
};
const CardHeaderIconButton = assignWithoutSideEffects(_CardHeaderIconButton, {
  componentId: ComponentIds.CardHeaderIconButton,
});

type CardHeaderProps = {
  children?: React.ReactNode;
} & TestID;

const _CardHeader = ({ children, testID }: CardHeaderProps): React.ReactElement => {
  useVerifyInsideCard('CardHeader');
  useVerifyAllowedChildren({
    children,
    componentName: 'CardHeader',
    allowedComponents: [ComponentIds.CardHeaderLeading, ComponentIds.CardHeaderTrailing],
  });

  return (
    <BaseBox
      marginBottom="spacing.7"
      {...metaAttribute({ name: MetaConstants.CardHeader, testID })}
    >
      <BaseBox
        marginBottom="spacing.7"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        {children}
      </BaseBox>
      <Divider />
    </BaseBox>
  );
};
const CardHeader = assignWithoutSideEffects(_CardHeader, { componentId: ComponentIds.CardHeader });

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
const _CardHeaderLeading = ({
  title,
  subtitle,
  prefix,
  suffix,
}: CardHeaderLeadingProps): React.ReactElement => {
  useVerifyInsideCard('CardHeaderLeading');

  if (__DEV__) {
    if (prefix && !isValidAllowedChildren(prefix, ComponentIds.CardHeaderIcon)) {
      throwBladeError({
        message: `Only \`${ComponentIds.CardHeaderIcon}\` component is accepted in prefix`,
        moduleName: 'CardHeaderLeading',
      });
    }

    if (suffix && !isValidAllowedChildren(suffix, ComponentIds.CardHeaderCounter)) {
      throwBladeError({
        message: `Only \`${ComponentIds.CardHeaderCounter}\` component is accepted in prefix`,
        moduleName: 'CardHeaderLeading',
      });
    }
  }

  return (
    <BaseBox flex={1} display="flex" flexDirection="row">
      <BaseBox marginRight="spacing.3" alignSelf="center" display="flex">
        {prefix}
      </BaseBox>
      <BaseBox marginRight="spacing.5">
        <BaseBox display="flex" flexDirection="row" alignItems="center" flexWrap="wrap">
          <Heading size="small" variant="regular" type="normal">
            {title}
          </Heading>
          <BaseBox marginLeft="spacing.3">{suffix}</BaseBox>
        </BaseBox>
        {subtitle && (
          <Text textAlign="left" variant="body" size="small" weight="regular">
            {subtitle}
          </Text>
        )}
      </BaseBox>
    </BaseBox>
  );
};
const CardHeaderLeading = assignWithoutSideEffects(_CardHeaderLeading, {
  componentId: ComponentIds.CardHeaderLeading,
});

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

const _CardHeaderTrailing = ({ visual }: CardHeaderTrailingProps): React.ReactElement => {
  useVerifyInsideCard('CardHeaderTrailing');

  if (__DEV__) {
    if (visual && !headerTrailingAllowedComponents.includes(getComponentId(visual)!)) {
      throwBladeError({
        message: `Only one of \`${headerTrailingAllowedComponents.join(
          ', ',
        )}\` component is accepted in visual`,
        moduleName: 'CardHeaderTrailing',
      });
    }
  }

  return <BaseBox alignSelf="center">{visual}</BaseBox>;
};
const CardHeaderTrailing = assignWithoutSideEffects(_CardHeaderTrailing, {
  componentId: ComponentIds.CardHeaderTrailing,
});

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
