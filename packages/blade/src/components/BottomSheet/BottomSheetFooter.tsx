/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react';
import { ComponentIds } from './componentIds';
import { Divider } from './Divider';
import { useBottomSheetContext } from './BottomSheet';
import BaseBox from '~components/Box/BaseBox';
import type { ButtonProps } from '~components/Button';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import type { WithComponentId } from '~utils';
import { getComponentId } from '~utils';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';
import { useTheme } from '~components/BladeProvider';

const BottomSheetFooterContext = React.createContext({ hasLeading: false, hasTrailing: false });

type BottomSheetFooterProps = {
  children?: React.ReactNode;
};

type BottomSheetFooterAction = Pick<
  ButtonProps,
  'type' | 'accessibilityLabel' | 'isLoading' | 'isDisabled' | 'icon' | 'iconPosition' | 'onClick'
> & {
  text: ButtonProps['children'];
};

type BottomSheetFooterLeadingProps = {
  title?: string;
  prefix?: React.ReactNode;
};

const BottomSheetFooterLeading: WithComponentId<BottomSheetFooterLeadingProps> = ({
  title,
  prefix,
}) => {
  return (
    <BaseBox display="flex" alignItems="center" flexDirection="row" userSelect="none">
      {prefix && (
        <BaseBox marginRight="spacing.4" display="flex" alignSelf="center">
          {prefix}
        </BaseBox>
      )}
      {title && (
        <BaseBox>
          <Text variant="body" size="medium" weight="regular">
            {title}
          </Text>
        </BaseBox>
      )}
    </BaseBox>
  );
};
BottomSheetFooterLeading.componentId = ComponentIds.BottomSheetFooterLeading;

type BottomSheetFooterTrailingProps = {
  actions?: {
    primary?: BottomSheetFooterAction;
    secondary?: BottomSheetFooterAction;
  };
};

const BottomSheetFooterTrailing: WithComponentId<BottomSheetFooterTrailingProps> = ({
  actions,
}) => {
  const { hasLeading } = React.useContext(BottomSheetFooterContext);
  const { primary, secondary } = actions || {};

  return (
    <BaseBox
      marginLeft="auto"
      display="flex"
      flexDirection="row"
      alignSelf="auto"
      width={hasLeading ? 'auto' : '100%'}
    >
      {secondary ? (
        <BaseBox flexGrow={1}>
          <Button isFullWidth size="medium" variant="secondary" {...secondary}>
            {secondary.text!}
          </Button>
        </BaseBox>
      ) : null}
      {secondary && primary ? <BaseBox marginLeft="spacing.5" /> : null}
      {primary ? (
        <BaseBox flexGrow={1}>
          <Button isFullWidth size="medium" {...primary}>
            {primary.text!}
          </Button>
        </BaseBox>
      ) : null}
    </BaseBox>
  );
};
BottomSheetFooterTrailing.componentId = ComponentIds.BottomSheetFooterTrailing;

const BottomSheetFooter = ({ children }: BottomSheetFooterProps): React.ReactElement => {
  const hasLeading = React.useRef(false);
  const hasTrailing = React.useRef(false);
  const { theme } = useTheme();
  const { setFooterHeight, isOpen, bind } = useBottomSheetContext();
  const ref = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    setFooterHeight(ref.current.getBoundingClientRect().height);
  }, [ref, isOpen]);

  React.useEffect(() => {
    React.Children.forEach(children, (child) => {
      const componentId = Boolean(child) && getComponentId(child)!;
      if (componentId === ComponentIds.BottomSheetFooterLeading) {
        hasLeading.current = true;
      }
      if (componentId === ComponentIds.BottomSheetFooterTrailing) {
        hasTrailing.current = true;
      }
    });
  }, [children]);

  return (
    <BottomSheetFooterContext.Provider
      value={{ hasLeading: hasLeading.current, hasTrailing: hasTrailing.current }}
    >
      <BaseBox
        data-footer
        width="100%"
        flexShrink={0}
        ref={ref}
        marginTop="auto"
        backgroundColor={theme.colors.surface.background.level2.lowContrast}
        touchAction="none"
        {...bind?.()}
      >
        <Divider />
        <BaseBox
          marginLeft="spacing.6"
          marginRight="spacing.6"
          marginTop="spacing.5"
          marginBottom="spacing.5"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="stretch"
        >
          {children}
        </BaseBox>
      </BaseBox>
    </BottomSheetFooterContext.Provider>
  );
};

export { BottomSheetFooter, BottomSheetFooterLeading, BottomSheetFooterTrailing };
