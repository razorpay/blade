/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { metaAttribute } from '~utils';

// const bodyStyles: React.CSSProperties = {
//   WebkitTapHighlightColor: 'revert',
//   WebkitTouchCallout: 'revert',
//   WebkitUserSelect: 'auto',
//   overscrollBehavior: 'contain',
//   WebkitOverflowScrolling: 'touch',
//   userSelect: 'auto',
//   overflow: 'auto',
//   touchAction: 'none',
// };

type ModalBodyProps = {
  children: React.ReactNode;
};

const _ModalBody = ({ children }: ModalBodyProps): React.ReactElement => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <BaseBox
      {...metaAttribute({
        testID: 'modal-body',
        name: 'modal-body',
      })}
    >
      <BaseBox
        paddingLeft="spacing.5"
        paddingRight="spacing.5"
        paddingTop="spacing.5"
        paddingBottom="spacing.5"
        ref={contentRef}
        // overflow="auto"
      >
        {children}
      </BaseBox>
    </BaseBox>
  );
};

const ModalBody = assignWithoutSideEffects(_ModalBody, {
  componentId: 'modal-body',
});

export { ModalBody };
export type { ModalBodyProps };
