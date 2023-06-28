import React from 'react';
import { Divider } from './Divider';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { metaAttribute } from '~utils/metaAttribute';
import type { TestID } from '~utils/types';

type BaseFooterProps = {
  children: React.ReactNode;
  metaComponentName?: string;
  showDivider?: boolean;
} & TestID;

const _BaseFooter = ({
  children,
  showDivider = true,
  metaComponentName,
  testID,
}: BaseFooterProps): React.ReactElement => {
  return (
    <>
      {showDivider && <Divider />}
      <BaseBox
        {...metaAttribute({ name: metaComponentName, testID })}
        padding={{ base: 'spacing.5', m: 'spacing.6' }}
      >
        {children}
      </BaseBox>
    </>
  );
};

const BaseFooter = assignWithoutSideEffects(_BaseFooter, {
  componentId: 'BaseFooter',
});

export { BaseFooter, BaseFooterProps };
