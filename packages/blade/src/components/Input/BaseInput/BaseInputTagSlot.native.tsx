import React from 'react';
import type { BaseInputTagSlotProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

const BaseInputTagSlot = ({
  tags,
  isMultiline,
  showAllTags,
}: BaseInputTagSlotProps): React.ReactElement | null => {
  if (!tags) {
    return null;
  }

  const invisibleTagsCount = tags.length - 3;

  if (tags.length <= 0) {
    return null;
  }

  return (
    <BaseBox
      paddingLeft="spacing.4"
      marginY="spacing.2"
      justifyContent="flex-start"
      display="flex"
      flexDirection="column"
      maxHeight="100px"
      // Move to using gap instead of marginLeft on individual tags after RN upgrade
      // gap="spacing.3"
    >
      <BaseBox
        // switch to these on `props.rows` value
        flexWrap={isMultiline ? 'wrap' : 'nowrap'}
        maxHeight={showAllTags && invisibleTagsCount ? '100%' : '84px'}
      >
        {tags}
      </BaseBox>
      {!showAllTags && invisibleTagsCount ? (
        <BaseBox flex="1" alignItems="center">
          <Text>+{invisibleTagsCount} More</Text>
        </BaseBox>
      ) : null}
    </BaseBox>
  );
};

export { BaseInputTagSlot };
