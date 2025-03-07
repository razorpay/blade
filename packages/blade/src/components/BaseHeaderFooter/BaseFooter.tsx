import React from 'react';
import { Divider } from '~components/Divider';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { metaAttribute } from '~utils/metaAttribute';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { BoxProps } from '~components/Box';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type BaseFooterProps = {
  children: React.ReactNode;
  metaComponentName?: string;
  showDivider?: boolean;
  padding?: BoxProps['padding'];
} & TestID &
  DataAnalyticsAttribute;

const _BaseFooter = ({
  children,
  showDivider = true,
  metaComponentName,
  padding,
  testID,
  ...rest
}: BaseFooterProps): React.ReactElement => {
  return (
    <>
      {showDivider && <Divider />}
      <BaseBox
        {...metaAttribute({ name: metaComponentName, testID })}
        {...makeAnalyticsAttribute(rest)}
        padding={padding ?? { base: 'spacing.5', m: 'spacing.6' }}
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
