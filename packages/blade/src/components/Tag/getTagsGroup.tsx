import React from 'react';
import { AnimatedTag } from './AnimatedTag';
import type { TagsGroupProps } from './types';

const getTagsGroup = ({
  tags,
  activeTagIndex,
  isDisabled,
  onDismiss,
}: TagsGroupProps): React.ReactElement[] => {
  return tags.map((tagName, tagIndex) => (
    <AnimatedTag
      key={tagName}
      activeTagIndex={activeTagIndex}
      onDismiss={onDismiss}
      currentTagIndex={tagIndex}
      tagsLength={tags.length}
      isDisabled={isDisabled}
    >
      {tagName}
    </AnimatedTag>
  ));
};

export { getTagsGroup };
