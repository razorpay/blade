import React from 'react';
import { useBottomSheetContext } from './BottomSheetContext';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _BottomSheetFooter = ({ children }: BaseFooterProps): React.ReactElement => {
  const { setFooterHeight, bind } = useBottomSheetContext();

  return (
    <BaseBox
      ref={(node) => {
        if (!node) return;
        setFooterHeight(node.getBoundingClientRect().height);
      }}
      width="100%"
      flexShrink={0}
      marginTop="auto"
      backgroundColor="popup.background.subtle"
      touchAction="none"
      zIndex={2}
      {...metaAttribute({ name: MetaConstants.BottomSheetFooter })}
      {...bind?.()}
    >
      <BaseFooter>{children}</BaseFooter>
    </BaseBox>
  );
};

const BottomSheetFooter = assignWithoutSideEffects(React.memo(_BottomSheetFooter), {
  displayName: 'BottomSheetFooter',
});

export { BottomSheetFooter };
