/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { ReactElement } from 'react';
import React from 'react';
import { useVerifyInsideCard } from './CardContext';
import { ComponentIds } from './Card';
import type { ButtonProps } from '~components/Button';
import { Button } from '~components/Button';
import { Divider } from '~components/Divider';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { TestID } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useIsMobile } from '~utils/useIsMobile';
import { throwBladeError } from '~utils/logger';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren/useVerifyAllowedChildren';

export type CardFooterAction = Pick<
  ButtonProps,
  'type' | 'accessibilityLabel' | 'isLoading' | 'isDisabled' | 'icon' | 'iconPosition' | 'onClick'
> & {
  text: ButtonProps['children'];
};

type CardFooterProps = {
  children?: React.ReactNode;
} & TestID;

const _CardFooter = ({ children, testID }: CardFooterProps): React.ReactElement => {
  const isMobile = useIsMobile();
  useVerifyInsideCard('CardFooter');
  useVerifyAllowedChildren({
    children,
    componentName: 'CardFooter',
    allowedComponents: [ComponentIds.CardFooterLeading, ComponentIds.CardFooterTrailing],
  });

  const footerChildrensArray = React.Children.toArray(children);
  if (__DEV__) {
    if (!React.isValidElement(footerChildrensArray[0])) {
      throwBladeError({
        message: `Invalid React Element ${footerChildrensArray}`,
        moduleName: 'CardFooter',
      });
    }
  }

  // the reason why we are checking for actions here is, because we want the footerTrailing
  // to always be aligned to the right
  // if we don't check for action here, and if we do not have footerTrailing and only footerLeading
  // then the content of footerLeading will be justified to the end.
  const baseBoxJustifyContent =
    footerChildrensArray.length === 2 || !(footerChildrensArray[0] as ReactElement)?.props?.actions
      ? 'space-between'
      : 'flex-end';

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
    <BaseBox textAlign={'left' as never}>
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
