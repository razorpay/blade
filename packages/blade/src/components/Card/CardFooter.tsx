/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react';
import type { ButtonProps } from '../Button';
import { Button } from '../Button';
import { Divider } from './Divider';
import { useVerifyInsideCard, useVerifyAllowedComponents } from './CardContext';
import { ComponentIds } from './Card';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { metaAttribute, MetaConstants, useBreakpoint } from '~utils';

import { useTheme } from '~components/BladeProvider';
import type { TestID } from '~src/_helpers/types';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

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

const _CardFooter = ({ children, testID }: CardFooterProps): React.ReactElement => {
  const isMobile = useIsMobile();
  useVerifyInsideCard('CardFooter');
  useVerifyAllowedComponents(children, 'CardFooter', [
    ComponentIds.CardFooterLeading,
    ComponentIds.CardFooterTrailing,
  ]);

  const footerChildrensArray = React.Children.toArray(children);
  if (!React.isValidElement(footerChildrensArray[0])) {
    throw new Error(`Invalid React Element ${footerChildrensArray}`);
  }

  const baseBoxJustifyContent =
    footerChildrensArray.length === 2 || !footerChildrensArray[0]?.props?.actions
      ? 'space-between'
      : 'end';

  return (
    <BaseBox marginTop="auto" {...metaAttribute({ name: MetaConstants.CardFooter, testID })}>
      <BaseBox marginTop="spacing.7" />
      <Divider />
      <BaseBox
        marginTop="spacing.7"
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent={baseBoxJustifyContent}
        alignItems={isMobile ? 'stretch' : 'center'}
      >
        {children}
      </BaseBox>
    </BaseBox>
  );
};
const CardFooter = assignWithoutSideEffects(_CardFooter, { componentId: ComponentIds.CardFooter });

type CardFooterLeadingProps = {
  title?: string;
  subtitle?: string;
};
const _CardFooterLeading = ({ title, subtitle }: CardFooterLeadingProps): React.ReactElement => {
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
const CardFooterLeading = assignWithoutSideEffects(_CardFooterLeading, {
  componentId: ComponentIds.CardFooterLeading,
});

type CardFooterTrailingProps = {
  actions?: {
    primary?: CardFooterAction;
    secondary?: CardFooterAction;
  };
};
const _CardFooterTrailing = ({ actions }: CardFooterTrailingProps): React.ReactElement => {
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
const CardFooterTrailing = assignWithoutSideEffects(_CardFooterTrailing, {
  componentId: ComponentIds.CardFooterTrailing,
});

export { CardFooter, CardFooterLeading, CardFooterTrailing };
