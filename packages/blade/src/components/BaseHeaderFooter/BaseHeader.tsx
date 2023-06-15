/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { Divider } from './Divider';
import BaseBox from '~components/Box/BaseBox';
import { Heading, Text } from '~components/Typography';
import { assignWithoutSideEffects, getComponentId, isReactNative, metaAttribute } from '~utils';
import { IconButton } from '~components/Button/IconButton';
import { ChevronLeftIcon, CloseIcon } from '~components/Icons';
import type { TestID } from '~src/_helpers/types';

type BaseHeaderProps = {
  title?: string;
  subtitle?: string;
  /**
   * Leading part of the header placed at the left most side of the header
   */
  leading?: React.ReactNode;
  /**
   * Trailing part of the header placed at the right most side of the header
   */
  trailing?: React.ReactNode;
  /**
   * Placed adjacent to the title text
   */
  titleSuffix?: React.ReactNode;
  /**
   * @default true
   */
  showDivider?: boolean;
  /**
   * @default false
   */
  showBackButton?: boolean;
  /**
   * @default true
   */
  showCloseButton?: boolean;
  onCloseButtonClick?: () => void;
  onBackButtonClick?: () => void;
  closeButtonRef?: React.MutableRefObject<any>;
  metaComponentName?: string;
} & Pick<
  ReactDOMAttributes,
  | 'onClickCapture'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onLostPointerCapture'
  | 'onPointerCancel'
  | 'onPointerDown'
  | 'onPointerMove'
  | 'onPointerUp'
> &
  TestID;

type TrailingComponents = 'Button' | 'Badge' | 'Link' | 'Text';

// prop restriction map for corresponding sub components
const propRestrictionMap = {
  Button: {
    size: 'xsmall',
    variant: 'tertiary',
  },
  Badge: {
    size: 'medium',
  },
  Link: {
    size: 'medium',
  },
  Text: {
    size: 'medium',
    variant: 'body',
  },
} as const;

const useTrailingRestriction = (trailing: React.ReactNode): React.ReactNode => {
  const [
    validatedTrailingComponent,
    setValidatedTrailingComponent,
  ] = React.useState<React.ReactElement | null>(null);

  // validate and restrict sub component props in trailing prop
  React.useEffect(() => {
    if (React.isValidElement(trailing)) {
      const trailingComponentType = getComponentId(trailing) as TrailingComponents;
      const restrictedProps = propRestrictionMap[trailingComponentType];
      const allowedComponents = Object.keys(propRestrictionMap);
      if (!restrictedProps) {
        throw new Error(
          `[Blade Header]: Only one of \`${allowedComponents.join(
            ', ',
          )}\` component is accepted as trailing`,
        );
      }

      const restrictedPropKeys = Object.keys(propRestrictionMap[trailingComponentType]);
      for (const prop of restrictedPropKeys) {
        if (trailing?.props?.hasOwnProperty(prop)) {
          console.warn(
            `[Blade Header]: Do not pass "${prop}" to "${trailingComponentType}" while inside Header trailing, because we override it.`,
          );
        }
      }
      setValidatedTrailingComponent(
        React.cloneElement(trailing as React.ReactElement, restrictedProps),
      );
    }
  }, [trailing]);

  return validatedTrailingComponent;
};

const _BaseHeader = ({
  title,
  subtitle,
  leading,
  titleSuffix,
  trailing,
  showDivider = true,
  showBackButton = false,
  showCloseButton = true,
  onBackButtonClick,
  onCloseButtonClick,
  closeButtonRef,
  testID,
  onClickCapture,
  onKeyDown,
  onKeyUp,
  onLostPointerCapture,
  onPointerCancel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  metaComponentName,
}: BaseHeaderProps): React.ReactElement => {
  const validatedTrailingComponent = useTrailingRestriction(trailing);

  const webOnlyEventHandlers = isReactNative()
    ? {}
    : {
        onClickCapture,
        onKeyDown,
        onKeyUp,
        onLostPointerCapture,
        onPointerCancel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
      };

  return (
    <BaseBox {...metaAttribute({ name: metaComponentName, testID })}>
      <BaseBox
        marginTop="spacing.4"
        marginBottom="spacing.5"
        paddingLeft="spacing.5"
        paddingRight="spacing.5"
        touchAction="none"
        {...webOnlyEventHandlers}
      >
        <BaseBox display="flex" flexDirection="row" alignItems="center" userSelect="none">
          {showBackButton ? (
            <BaseBox overflow="visible" marginRight="spacing.5">
              <IconButton
                size="large"
                icon={ChevronLeftIcon}
                onClick={() => onBackButtonClick?.()}
                accessibilityLabel="Back"
              />
            </BaseBox>
          ) : null}
          <BaseBox
            paddingRight="spacing.5"
            marginRight="auto"
            flex="auto"
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            {leading ? (
              <BaseBox
                width="spacing.8"
                height="spacing.8"
                flexShrink={0}
                marginRight="spacing.3"
                justifyContent="center"
                alignItems="center"
                display="flex"
              >
                {leading}
              </BaseBox>
            ) : null}
            <BaseBox>
              <BaseBox flexShrink={0} display="flex" flexDirection="row" alignItems="center">
                {title ? (
                  <Heading size="small" variant="regular" type="normal">
                    {title}
                  </Heading>
                ) : null}
                {titleSuffix && <BaseBox marginLeft="spacing.3">{titleSuffix}</BaseBox>}
              </BaseBox>
              {subtitle ? (
                <Text variant="body" size="small" weight="regular" type="muted">
                  {subtitle}
                </Text>
              ) : null}
            </BaseBox>
          </BaseBox>
          {validatedTrailingComponent ? (
            <BaseBox marginRight="spacing.5">{validatedTrailingComponent}</BaseBox>
          ) : null}
          {showCloseButton ? (
            <IconButton
              ref={closeButtonRef}
              size="large"
              icon={CloseIcon}
              accessibilityLabel="Close"
              onClick={() => onCloseButtonClick?.()}
            />
          ) : null}
        </BaseBox>
      </BaseBox>
      {showDivider ? <Divider /> : null}
    </BaseBox>
  );
};

const BaseHeader = assignWithoutSideEffects(_BaseHeader, {
  componentId: 'BaseHeader',
});

export { BaseHeader, BaseHeaderProps };
