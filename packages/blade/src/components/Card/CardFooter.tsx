/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react';
import type { ButtonProps } from '../Button';
import { Button } from '../Button';
import { Divider } from './Divider';
import { useVerifyInsideCard, useVerifyAllowedComponents } from './CardContext';
import { ComponentIds } from './Card';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import type { WithComponentId } from '~utils';
import { metaAttribute, MetaConstants, useBreakpoint } from '~utils';

import { useTheme } from '~components/BladeProvider';
import type { TestID } from '~src/_helpers/types';

export type CardFooterAction = Pick<
  ButtonProps,
  'type' | 'accessibilityLabel' | 'isLoading' | 'isDisabled' | 'icon' | 'iconPosition' | 'onClick'
> & {
  text: ButtonProps['children'];
};

type CardFooterProps = {
  children?: React.ReactNode;
} & TestID;

const useIsMobile = (): boolean => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  return matchedDeviceType === 'mobile';
};

const CardFooter: WithComponentId<CardFooterProps> = ({ children, testID }) => {
  const isMobile = useIsMobile();
  useVerifyInsideCard('CardFooter');
  useVerifyAllowedComponents(children, 'CardFooter', [
    ComponentIds.CardFooterLeading,
    ComponentIds.CardFooterTrailing,
  ]);

  return (
    <BaseBox marginTop="auto" {...metaAttribute({ name: MetaConstants.CardFooter, testID })}>
      <BaseBox marginTop="spacing.7" />
      <Divider />
      <BaseBox
        marginTop="spacing.7"
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isMobile ? 'stretch' : 'center'}
      >
        {children}
      </BaseBox>
    </BaseBox>
  );
};
CardFooter.componentId = ComponentIds.CardFooter;

type CardFooterLeadingProps = {
  title?: string;
  subtitle?: string;
};
const CardFooterLeading: WithComponentId<CardFooterLeadingProps> = ({ title, subtitle }) => {
  useVerifyInsideCard('CardFooterLeading');

  return (
    <BaseBox>
      {title && (
        <Text variant="body" size="medium" weight="bold">
          {title}
        </Text>
      )}
      {subtitle && (
        <Text variant="body" size="small" weight="regular">
          {subtitle}
        </Text>
      )}
    </BaseBox>
  );
};
CardFooterLeading.componentId = ComponentIds.CardFooterLeading;

type CardFooterTrailingProps = {
  actions?: {
    primary?: CardFooterAction;
    secondary?: CardFooterAction;
  };
};
const CardFooterTrailing: WithComponentId<CardFooterTrailingProps> = ({ actions }) => {
  const isMobile = useIsMobile();
  useVerifyInsideCard('CardFooterTrailing');

  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      alignSelf={isMobile ? 'auto' : 'center'}
      marginTop={isMobile ? 'spacing.5' : 'spacing.0'}
      marginLeft={isMobile ? 'spacing.0' : 'spacing.5'}
    >
      <BaseBox flexGrow={1}>
        {actions?.secondary ? (
          <Button isFullWidth size="medium" variant="secondary" {...actions.secondary}>
            {actions.secondary.text!}
          </Button>
        ) : null}
      </BaseBox>
      <BaseBox marginLeft="spacing.5" />
      <BaseBox flexGrow={1}>
        {actions?.primary ? (
          <Button isFullWidth size="medium" {...actions.primary}>
            {actions.primary.text!}
          </Button>
        ) : null}
      </BaseBox>
    </BaseBox>
  );
};
CardFooterTrailing.componentId = ComponentIds.CardFooterTrailing;

export { CardFooter, CardFooterLeading, CardFooterTrailing };
