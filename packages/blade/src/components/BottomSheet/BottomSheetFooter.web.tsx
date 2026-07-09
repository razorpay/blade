import React from 'react';
import { useBottomSheetContext } from './BottomSheetContext';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import BaseBox from '~components/Box/BaseBox';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { BOTTOM_SHEET_EASING } from './utils';

const footerStyles: React.CSSProperties = {
  transitionProperty: 'height, opacity',
  transitionTimingFunction: BOTTOM_SHEET_EASING,
  transitionDuration: 'var(--bs-transition-duration, 280ms)',
  willChange: 'height, opacity',
};

const BottomSheetFooter = ({
  children,
  ...dataAnalyticsProps
}: BaseFooterProps): React.ReactElement => {
  const { setFooterHeight, isOpen, bind } = useBottomSheetContext();
  const ref = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    setFooterHeight(ref.current.getBoundingClientRect().height);
  }, [ref, isOpen]);

  return (
    <BaseBox
      ref={ref}
      width="100%"
      flexShrink={0}
      marginTop="auto"
      backgroundColor="popup.background.gray.subtle"
      touchAction="none"
      zIndex={2}
      style={footerStyles}
      {...metaAttribute({ name: MetaConstants.BottomSheetFooter })}
      {...bind?.()}
      {...makeAnalyticsAttribute(dataAnalyticsProps)}
    >
      <BaseFooter>{children}</BaseFooter>
    </BaseBox>
  );
};

export { BottomSheetFooter };
