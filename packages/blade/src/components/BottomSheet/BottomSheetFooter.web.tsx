import React from 'react';
import { useBottomSheetContext } from './BottomSheetContext';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import BaseBox from '~components/Box/BaseBox';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useTheme } from '~components/BladeProvider';
import { makeMotionTime } from '~utils/makeMotionTime';

const BOTTOM_SHEET_EASING = 'cubic-bezier(.15,0,.24,.97)';

const BottomSheetFooter = ({
  children,
  ...dataAnalyticsProps
}: BaseFooterProps): React.ReactElement => {
  const { setFooterHeight, isOpen, isDragging, bind } = useBottomSheetContext();
  const { theme } = useTheme();
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
      backgroundColor="popup.background.gray.subtle"
      touchAction="none"
      zIndex={2}
      style={{
        transform: isOpen ? 'translateY(0px)' : 'translateY(8px)',
        transitionProperty: 'transform',
        transitionDuration: isDragging ? undefined : makeMotionTime(theme.motion.duration.moderate),
        transitionTimingFunction: BOTTOM_SHEET_EASING,
        willChange: 'transform',
      }}
      {...metaAttribute({ name: MetaConstants.BottomSheetFooter })}
      {...bind?.()}
      {...makeAnalyticsAttribute(dataAnalyticsProps)}
    >
      <BaseFooter>{children}</BaseFooter>
    </BaseBox>
  );
};

export { BottomSheetFooter };
