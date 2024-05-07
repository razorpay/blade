import React from 'react';
import { AnimatedTag } from './AnimatedTag';
import type { TagsGroupProps } from './types';

const getTagsGroup = ({
  tags,
  activeTagIndex,
  isDisabled,
  onDismiss,
  size = 'medium',
}: TagsGroupProps): React.ReactElement[] => {
  return tags.map((tagName, tagIndex) => (
    <AnimatedTag
      key={`${tagName}-${tagIndex}`}
      activeTagIndex={activeTagIndex}
      onDismiss={onDismiss}
      currentTagIndex={tagIndex}
      tagsLength={tags.length}
      isDisabled={isDisabled}
      size={size}
    >
      {tagName}
    </AnimatedTag>
  ));
};

export { getTagsGroup };
