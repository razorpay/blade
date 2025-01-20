/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';
import { footerPaddingTop, headerMarginBottom, overlayPaddingX } from '../tokens';
import type { DropdownFooterProps, DropdownHeaderProps } from '../types';
import { DropdownDivider } from './DropdownDivider';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute/metaConstants';
import { Box } from '~components/Box';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _DropdownHeader = ({
  title,
  subtitle,
  leading,
  titleSuffix,
  trailing,
  testID,
  ...rest
}: DropdownHeaderProps): React.ReactElement => {
  return (
    <Box marginBottom="spacing.3">
      <BaseHeader
        title={title}
        subtitle={subtitle}
        leading={leading}
        trailing={trailing}
        titleSuffix={titleSuffix}
        metaComponentName={MetaConstants.DropdownHeader}
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
      <DropdownDivider />
    </Box>
  );
};

const DropdownHeader = assignWithoutSideEffects(_DropdownHeader, {
  componentId: 'DropdownHeader',
});

const _DropdownFooter = ({
  children,
  testID,
  ...rest
}: DropdownFooterProps): React.ReactElement => {
  return (
    <Box marginTop="spacing.3">
      <DropdownDivider />
      <BaseFooter
        metaComponentName={MetaConstants.DropdownFooter}
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

const DropdownFooter = assignWithoutSideEffects(_DropdownFooter, {
  componentId: 'DropdownFooter',
});

export { DropdownHeader, DropdownFooter };
