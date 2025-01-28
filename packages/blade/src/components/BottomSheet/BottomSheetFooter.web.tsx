import React from 'react';
import { useBottomSheetContext } from './BottomSheetContext';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import BaseBox from '~components/Box/BaseBox';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const BottomSheetFooter = ({
  children,
  ...dataAnalyticsProps
}: BaseFooterProps): React.ReactElement => {
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
      backgroundColor="popup.background.subtle"
      touchAction="none"
      zIndex={2}
      {...metaAttribute({ name: MetaConstants.BottomSheetFooter })}
      {...bind?.()}
      {...makeAnalyticsAttribute(dataAnalyticsProps)}
    >
      <BaseFooter>{children}</BaseFooter>
    </BaseBox>
  );
};

export { BottomSheetFooter };
