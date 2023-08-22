import React from 'react';
import { Tag } from './Tag';
import type { AnimatedTagProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const AnimatedTag = ({
  children,
  currentTagIndex,
  activeTagIndex,
  onDismiss,
}: AnimatedTagProps): React.ReactElement => {
  return (
    <BaseBox>
      <Tag
        _isVirtuallyFocussed={currentTagIndex === activeTagIndex}
        _isTagInsideInput={true}
        onDismiss={() => {
          onDismiss({ tagIndex: currentTagIndex, tagName: children });
        }}
        marginRight="spacing.3"
        marginY="spacing.2"
      >
        {children}
      </Tag>
    </BaseBox>
  );
};

export { AnimatedTag };
