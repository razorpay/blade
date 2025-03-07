/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';
import { footerPaddingTop, headerMarginBottom, overlayPaddingX } from '../tokens';
import type { MenuFooterProps, MenuHeaderProps } from '../types';
import { MenuDivider } from './MenuDivider';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute/metaConstants';
import { Box } from '~components/Box';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _MenuHeader = ({
  title,
  subtitle,
  leading,
  titleSuffix,
  trailing,
  testID,
  ...rest
}: MenuHeaderProps): React.ReactElement => {
  return (
    <Box marginBottom="spacing.3">
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
        paddingX={overlayPaddingX}
        marginTop="spacing.0"
        marginBottom={headerMarginBottom}
        showDivider={false}
        {...makeAnalyticsAttribute(rest)}
      />
      <MenuDivider />
    </Box>
  );
};

const MenuHeader = assignWithoutSideEffects(_MenuHeader, {
  componentId: 'MenuHeader',
});

const _MenuFooter = ({ children, testID, ...rest }: MenuFooterProps): React.ReactElement => {
  return (
    <Box marginTop="spacing.3">
      <MenuDivider />
      <BaseFooter
        metaComponentName={MetaConstants.MenuFooter}
        showDivider={false}
        padding={[footerPaddingTop, overlayPaddingX, 'spacing.0', overlayPaddingX]}
        testID={testID}
        {...makeAnalyticsAttribute(rest)}
      >
        {children}
      </BaseFooter>
    </Box>
  );
};

const MenuFooter = assignWithoutSideEffects(_MenuFooter, {
  componentId: 'MenuFooter',
});

export { MenuHeader, MenuFooter };
