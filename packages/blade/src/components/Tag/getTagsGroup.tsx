import React from 'react';
import { AnimatedTag } from './AnimatedTag';
import { TagsGroupProps } from './types';

const getTagsGroup = ({
  tags,
  activeTagIndex,
  onDismiss,
}: TagsGroupProps): React.ReactElement[] => {
  return tags.map((tagName, tagIndex) => (
    <AnimatedTag
      key={tagName}
      activeTagIndex={activeTagIndex}
      onDismiss={onDismiss}
      currentTagIndex={tagIndex}
      tagsLength={tags.length}
    >
      {tagName}
    </AnimatedTag>
  ));
};

export { getTagsGroup };
