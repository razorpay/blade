/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react';
// Type generation fails if we import this type via `~components/Button`
// Related issue: https://github.com/razorpay/blade/issues/701
import type { ButtonProps } from '../../components/Button';
import { ComponentIds } from './componentIds';
import { Divider } from './Divider';
import { useBottomSheetContext } from './BottomSheetContext';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';
import { useTheme } from '~components/BladeProvider';
import { assignWithoutSideEffects } from '~utils';

type BottomSheetFooterProps = {
  title?: string;
  leading?: React.ReactNode;
  trailing?: {
    primary?: BottomSheetFooterAction;
    secondary?: BottomSheetFooterAction;
  };
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

const _BottomSheetFooterLeading = ({
  title,
  prefix,
}: BottomSheetFooterLeadingProps): React.ReactElement => {
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

const BottomSheetFooterLeading = assignWithoutSideEffects(_BottomSheetFooterLeading, {
  componentId: ComponentIds.BottomSheetFooterLeading,
});

type BottomSheetFooterTrailingProps = {
  actions?: {
    primary?: BottomSheetFooterAction;
    secondary?: BottomSheetFooterAction;
  };
  hasLeading: boolean;
};

const _BottomSheetFooterTrailing = ({
  actions,
  hasLeading,
}: BottomSheetFooterTrailingProps): React.ReactElement => {
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
const BottomSheetFooterTrailing = assignWithoutSideEffects(_BottomSheetFooterTrailing, {
  componentId: ComponentIds.BottomSheetFooterTrailing,
});

const BottomSheetFooter = ({
  title,
  leading,
  trailing,
}: BottomSheetFooterProps): React.ReactElement => {
  const { theme } = useTheme();
  const { setFooterHeight, isOpen, bind } = useBottomSheetContext();
  const ref = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    // for some reason the calculated footer height is changing when user drags the sheet
    // although i don't see a reason why, thus putting it in a setTimeout so that
    // we calculate the height on the next browser paint
    window.setTimeout(() => {
      if (!ref.current) return;
      setFooterHeight(ref.current.getBoundingClientRect().height);
    });
  }, [ref, isOpen]);

  return (
    <BaseBox
      ref={ref}
      width="100%"
      flexShrink={0}
      marginTop="auto"
      backgroundColor={theme.colors.surface.background.level2.lowContrast}
      touchAction="none"
      zIndex={2}
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
        <BottomSheetFooterLeading title={title} prefix={leading} />
        <BottomSheetFooterTrailing hasLeading={Boolean(leading)} actions={trailing} />
      </BaseBox>
    </BaseBox>
  );
};

export { BottomSheetFooter, BottomSheetFooterLeading, BottomSheetFooterTrailing };
