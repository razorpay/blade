/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';

type DropdownHeaderProps = Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'trailing' | 'titleSuffix'
>;

const _DropdownHeader = ({
  title,
  subtitle,
  leading,
  titleSuffix,
  trailing,
}: DropdownHeaderProps): React.ReactElement => {
  return (
    <BaseBox overflow={'auto' as never} flexShrink={0}>
      <BaseHeader
        title={title}
        subtitle={subtitle}
        leading={leading}
        trailing={trailing}
        titleSuffix={titleSuffix}
        // back button
        showBackButton={false}
        // close button
        showCloseButton={false}
      />
    </BaseBox>
  );
};

const DropdownHeader = assignWithoutSideEffects(_DropdownHeader, {
  componentId: 'DropdownHeader',
});

type DropdownFooter = Pick<BaseFooterProps, 'children'>;

const _DropdownFooter = ({ children }: DropdownFooter): React.ReactElement => {
  return <BaseFooter>{children}</BaseFooter>;
};

const DropdownFooter = assignWithoutSideEffects(_DropdownFooter, {
  componentId: 'DropdownFooter',
});

export { DropdownHeader, DropdownFooter };
