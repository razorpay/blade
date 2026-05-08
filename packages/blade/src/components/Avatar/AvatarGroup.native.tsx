import React from 'react';
import type { AvatarGroupProps, AvatarGroupContextType } from './types';
import { avatarSizeTokens } from './avatarTokens';
import { AvatarGroupProvider } from './AvatarGroupContext';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import { isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import BaseBox from '~components/Box/BaseBox';
import { makeAccessible } from '~utils/makeAccessible';

const _AvatarGroup = ({
  children,
  size = 'medium',
  maxCount,
  testID,
  ...rest
}: AvatarGroupProps): React.ReactElement => {
  const contextValue: AvatarGroupContextType = { size };
  const childrenCount = React.Children.count(children);
  const overlapMargin = -(avatarSizeTokens[size] / 2);

  return (
    <AvatarGroupProvider value={contextValue}>
      <BaseBox
        {...metaAttribute({ name: MetaConstants.AvatarGroup, testID })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
        {...makeAccessible({ role: 'group' })}
        display="flex"
        flexDirection="row"
      >
        {React.Children.map(children, (child, index) => {
          if (__DEV__) {
            if (!isValidAllowedChildren(child, 'Avatar')) {
              throwBladeError({
                moduleName: 'AvatarGroup',
                message: 'Only "Avatar" component is allowed as a children.',
              });
            }
          }

          if (maxCount && maxCount <= childrenCount) {
            if (index === maxCount) {
              // Render overflow count avatar
              return (
                <BaseBox style={{ marginLeft: index > 0 ? overlapMargin : 0, zIndex: index + 1 }}>
                  <BaseBox
                    style={{
                      width: avatarSizeTokens[size],
                      height: avatarSizeTokens[size],
                      borderRadius: 9999,
                      backgroundColor: '#E0E0E0',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Rendered by Avatar's text path */}
                  </BaseBox>
                </BaseBox>
              );
            }
            if (index > maxCount) return null;
          }

          return (
            <BaseBox style={{ marginLeft: index > 0 ? overlapMargin : 0, zIndex: index + 1 }}>
              {child}
            </BaseBox>
          );
        })}
      </BaseBox>
    </AvatarGroupProvider>
  );
};

const AvatarGroup = assignWithoutSideEffects(_AvatarGroup, {
  displayName: 'AvatarGroup',
  componentId: 'AvatarGroup',
});

export { AvatarGroup };
export type { AvatarGroupProps };
