import React from 'react';
import { Divider } from './Divider';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils';

export type BaseFooterProps = {
  children: React.ReactNode;
  hideDivider?: boolean;
};

const _BaseFooter = ({ children, hideDivider = false }: BaseFooterProps): React.ReactElement => {
  return (
    <>
      {!hideDivider && <Divider />}
      <BaseBox
        marginLeft="spacing.6"
        marginRight="spacing.6"
        marginTop="spacing.5"
        marginBottom="spacing.5"
      >
        {children}
      </BaseBox>
    </>
  );
};

const BaseFooter = assignWithoutSideEffects(_BaseFooter, {
  componentId: 'BaseFooter',
});

export { BaseFooter };
