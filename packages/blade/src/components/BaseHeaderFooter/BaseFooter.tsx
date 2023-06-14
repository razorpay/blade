import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Divider } from '~components/Divider';
import { assignWithoutSideEffects, metaAttribute } from '~utils';

type BaseFooterProps = {
  children: React.ReactNode;
  metaComponentName?: string;
  showDivider?: boolean;
};

const _BaseFooter = ({
  children,
  showDivider = true,
  metaComponentName,
}: BaseFooterProps): React.ReactElement => {
  return (
    <>
      {showDivider && <Divider />}
      <BaseBox
        {...metaAttribute({ name: metaComponentName })}
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
