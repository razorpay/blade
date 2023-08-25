import React from 'react';
import { ScrollView, Text as RNText } from 'react-native';
import styled from 'styled-components';
import type { BaseInputTagSlotProps } from './types';
import BaseBox from '~components/Box/BaseBox';

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
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [isScrolling, setIsScrolling] = React.useState(false);
  return (
    <StyledScrollView
      ref={scrollViewRef}
      contentContainerStyle={{
        flexWrap: 'wrap',
        position: 'relative',
      }}
      onScrollBeginDrag={() => {
        setIsScrolling(true);
      }}
      onScrollEndDrag={() => {
        setIsScrolling(false);
      }}
      horizontal={true}
      showsHorizontalScrollIndicator={tagRows === '1'}
      onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
    >
      {/* This creates a clickable layer behind tags so if user clicks empty area between of tags, it handles opening of Dropdown */}
      <BaseBox
        position="absolute"
        height="100%"
        width="100%"
        onTouchEndCapture={() => {
          if (!isScrolling) {
            handleOnClick?.({ name: '', value: '' });
          }
        }}
      />
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
          <RNText
            onPress={() => {
              handleOnClick?.({ name: '', value: '' });
            }}
            style={{ alignSelf: 'center' }}
          >
            +{invisibleTagsCount} More
          </RNText>
        ) : null}
      </ScrollableTagSlotContainer>
    </BaseBox>
  );
};

export { BaseInputTagSlot };
