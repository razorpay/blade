import React from 'react';
import { Divider } from '~components/Divider';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { metaAttribute } from '~utils/metaAttribute';
import type { TestID } from '~utils/types';
import type { BoxProps } from '~components/Box';

type BaseFooterProps = {
  children: React.ReactNode;
  metaComponentName?: string;
  showDivider?: boolean;
  paddingX?: BoxProps['paddingX'];
  paddingY?: BoxProps['paddingY'];
} & TestID;

const _BaseFooter = ({
  children,
  showDivider = true,
  metaComponentName,
  paddingX,
  paddingY,
  testID,
}: BaseFooterProps): React.ReactElement => {
  return (
    <>
      {showDivider && <Divider />}
      <BaseBox
        {...metaAttribute({ name: metaComponentName, testID })}
        paddingX={paddingX ?? { base: 'spacing.5', m: 'spacing.6' }}
        paddingY={paddingY ?? { base: 'spacing.5', m: 'spacing.6' }}
      >
        {children}
      </BaseBox>
    </>
  );
};

const BaseFooter = assignWithoutSideEffects(_BaseFooter, {
  componentId: 'BaseFooter',
});

export type { BaseFooterProps };
export { BaseFooter };
