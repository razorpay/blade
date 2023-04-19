/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react';
import { Divider } from './Divider';
import { useBottomSheetContext } from './BottomSheetContext';
import type { BottomSheetFooterProps } from './types';
import { BottomSheetFooterLeading, BottomSheetFooterTrailing } from './BottomSheetFooterCommon';
import BaseBox from '~components/Box/BaseBox';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';
import { useTheme } from '~components/BladeProvider';

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
      data-footer
      data-testid="bottomsheet-footer"
      ref={ref as any}
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
