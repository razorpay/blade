import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components';
import type { BaseInputTagSlotProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

const StyledScrollView = styled(ScrollView)((_props) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    // gap is still not working in RN for some reason
    // gap: makeSpace(props.theme.spacing[3]),
  };
});

const ScrollableTagSlotContainer = ({
  tagRows,
  children,
  handleOnClick,
}: Pick<BaseInputTagSlotProps, 'tagRows' | 'showAllTags' | 'handleOnClick'> & {
  children: (React.ReactNode | null)[];
}): React.ReactElement => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  return (
    <StyledScrollView
      contentContainerStyle={{
        flexWrap: 'wrap',
      }}
      onScrollBeginDrag={() => {
        setIsScrolling(true);
      }}
      onScrollEndDrag={() => {
        setIsScrolling(false);
      }}
      onTouchEndCapture={() => {
        if (!isScrolling) {
          handleOnClick?.({ name: '', value: '' });
        }
      }}
      horizontal={true}
      showsHorizontalScrollIndicator={tagRows === '1'}
    >
      {children}
    </StyledScrollView>
  );
};

const BaseInputTagSlot = ({
  tags,
  tagRows,
  showAllTags,
  handleOnClick,
}: BaseInputTagSlotProps): React.ReactElement | null => {
  if (!tags) {
    return null;
  }

  const invisibleTagsCount = tags.length - 2;

  if (tags.length <= 0) {
    return null;
  }

  return (
    <BaseBox
      paddingLeft="spacing.4"
      marginY="spacing.1"
      justifyContent="flex-start"
      display="flex"
      flexDirection="row"
      maxHeight="100px"
      flex="1"
    >
      <ScrollableTagSlotContainer
        tagRows={tagRows}
        showAllTags={showAllTags}
        handleOnClick={handleOnClick}
      >
        {showAllTags ? tags : tags.slice(0, 2)}
        {invisibleTagsCount > 0 && !showAllTags ? (
          <Text alignSelf="center">+{invisibleTagsCount} More</Text>
        ) : null}
      </ScrollableTagSlotContainer>
    </BaseBox>
  );
};

export { BaseInputTagSlot };
