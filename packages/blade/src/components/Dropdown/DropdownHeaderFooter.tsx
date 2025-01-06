/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';
import { useDropdown } from './useDropdown';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import BaseBox from '~components/Box/BaseBox';
import { isReactNative } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import { MetaConstants } from '~utils/metaAttribute/metaConstants';
import type { DataAnalyticsAttribute } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type DropdownHeaderProps = Pick<
  BaseHeaderProps,
  | 'title'
  | 'subtitle'
  | 'leading'
  | 'trailing'
  | 'titleSuffix'
  | 'testID'
  | keyof DataAnalyticsAttribute
>;

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
    <BaseBox
      flexShrink={0}
      {...(isReactNative()
        ? {}
        : {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onMouseDown: (e: any) => {
              // we don't want focus to ever move on header because its static element
              e.preventDefault();
            },
          })}
    >
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
        {...makeAnalyticsAttribute(rest)}
      />
    </BaseBox>
  );
};

const DropdownHeader = assignWithoutSideEffects(_DropdownHeader, {
  componentId: 'DropdownHeader',
});

type DropdownFooter = Pick<BaseFooterProps, 'children' | 'testID'>;

const _DropdownFooter = ({ children, testID }: DropdownFooter): React.ReactElement => {
  const { setHasFooterAction, isOpen } = useDropdown();
  const footerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setHasFooterAction(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseBox
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={footerRef as any}
      {...makeAccessible({
        role: isReactNative() ? undefined : 'group',
      })}
    >
      <BaseFooter metaComponentName={MetaConstants.DropdownFooter} testID={testID}>
        {/* We don't want any of the interactive children to get focussed on TAB when dropdown is closed so we remove them from DOM itself */}
        {isOpen ? children : null}
      </BaseFooter>
    </BaseBox>
  );
};

const DropdownFooter = assignWithoutSideEffects(_DropdownFooter, {
  componentId: 'DropdownFooter',
});

export { DropdownHeader, DropdownFooter };
