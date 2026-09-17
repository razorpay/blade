import React from 'react';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type SectionedCardSlotProps = {
  children: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;

const createSectionedCardSlot = (
  componentId: string,
  metaName: string,
): React.FC<SectionedCardSlotProps> => {
  const Slot = ({ children, testID, ...rest }: SectionedCardSlotProps): React.ReactElement => {
    return (
      <BaseBox {...metaAttribute({ name: metaName, testID })} {...makeAnalyticsAttribute(rest)}>
        {children}
      </BaseBox>
    );
  };

  return assignWithoutSideEffects(Slot, { componentId });
};

export { createSectionedCardSlot };
export type { SectionedCardSlotProps };
