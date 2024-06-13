/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';
import { MenuDivider } from './MenuDivider';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute/metaConstants';

type MenuHeaderProps = Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'trailing' | 'titleSuffix' | 'testID'
>;

const _MenuHeader = ({
  title,
  subtitle,
  leading,
  titleSuffix,
  trailing,
  testID,
}: MenuHeaderProps): React.ReactElement => {
  return (
    <>
      <BaseHeader
        title={title}
        subtitle={subtitle}
        leading={leading}
        trailing={trailing}
        titleSuffix={titleSuffix}
        metaComponentName={MetaConstants.MenuHeader}
        testID={testID}
        // back button
        showBackButton={false}
        // close button
        showCloseButton={false}
        paddingX="spacing.3"
        marginTop="spacing.0"
        marginBottom="spacing.3"
        showDivider={false}
      />
      <MenuDivider />
    </>
  );
};

const MenuHeader = assignWithoutSideEffects(_MenuHeader, {
  componentId: 'MenuHeader',
});

type MenuFooter = Pick<BaseFooterProps, 'children' | 'testID'>;

const _MenuFooter = ({ children, testID }: MenuFooter): React.ReactElement => {
  return (
    <>
      <MenuDivider />
      <BaseFooter
        metaComponentName={MetaConstants.MenuFooter}
        showDivider={false}
        padding={['spacing.3', 'spacing.3', 'spacing.0', 'spacing.3']}
        testID={testID}
      >
        {children}
      </BaseFooter>
    </>
  );
};

const MenuFooter = assignWithoutSideEffects(_MenuFooter, {
  componentId: 'MenuFooter',
});

export { MenuHeader, MenuFooter };
