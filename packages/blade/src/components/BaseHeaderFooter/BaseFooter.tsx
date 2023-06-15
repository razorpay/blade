import React from 'react';
import { Divider } from './Divider';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects, metaAttribute } from '~utils';
import type { TestID } from '~src/_helpers/types';

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
      <BaseBox {...metaAttribute({ name: metaComponentName, testID })} padding="spacing.5">
        {children}
      </BaseBox>
    </>
  );
};

const BaseFooter = assignWithoutSideEffects(_BaseFooter, {
  componentId: 'BaseFooter',
});

export { BaseFooter, BaseFooterProps };
