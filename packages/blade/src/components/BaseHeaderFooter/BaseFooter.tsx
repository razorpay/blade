import React from 'react';
import { Divider } from './Divider';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils';

type BaseFooterProps = {
  children: React.ReactNode;
  showDivider?: boolean;
};

const _BaseFooter = ({ children, showDivider = true }: BaseFooterProps): React.ReactElement => {
  return (
    <>
      {showDivider && <Divider />}
      <BaseBox
        paddingLeft="spacing.6"
        paddingRight="spacing.6"
        paddingTop="spacing.5"
        paddingBottom="spacing.5"
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
