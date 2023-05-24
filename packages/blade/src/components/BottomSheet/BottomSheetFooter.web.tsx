import React from 'react';
import { useBottomSheetContext } from './BottomSheetContext';
import { ComponentIds } from './componentIds';
import BaseBox from '~components/Box/BaseBox';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useTheme } from '~components/BladeProvider';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import { metaAttribute } from '~utils';

const BottomSheetFooter = ({ children }: BaseFooterProps): React.ReactElement => {
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
      {...metaAttribute({ name: ComponentIds.BottomSheetFooter })}
      {...bind?.()}
    >
      <BaseFooter>{children}</BaseFooter>
    </BaseBox>
  );
};

export { BottomSheetFooter };
