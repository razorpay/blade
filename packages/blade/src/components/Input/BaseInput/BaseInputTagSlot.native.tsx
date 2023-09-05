import React from 'react';
import { ScrollView, Text as RNText } from 'react-native';
import styled from 'styled-components';
import type { BaseInputTagSlotProps } from './types';
import { BASEINPUT_DEFAULT_HEIGHT, BASEINPUT_WRAPPER_MAX_HEIGHT } from './baseInputConfig';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils';
import { size } from '~tokens/global';

const StyledScrollView = styled(ScrollView)((_props) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    // gap is still not working in RN for some reason
    // gap: makeSpace(props.theme.spacing[3]),
  };
});

const ScrollableTagSlotContainer = ({
  maxTagRows,
  children,
  handleOnClick,
}: Pick<BaseInputTagSlotProps, 'maxTagRows' | 'showAllTags' | 'handleOnClick'> & {
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
      showsHorizontalScrollIndicator={maxTagRows === 'single'}
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

const PLUS_X_MORE_TEXT_WIDTH = 60;

const BaseInputTagSlot = ({
  tags,
  maxTagRows,
  showAllTags,
  handleOnClick,
  renderAs,
  children,
}: BaseInputTagSlotProps): React.ReactElement | null => {
  const hasTags = tags && tags.length > 0;
  const [visibleTags, setVisibleTags] = React.useState(maxTagRows === 'multiple' ? 6 : 1);
  const invisibleTagsCount = tags ? tags.length - visibleTags : 0;

  return (
    <BaseBox
      justifyContent="flex-start"
      paddingY={hasTags ? 'spacing.1' : 'spacing.0'}
      paddingX={hasTags ? 'spacing.3' : 'spacing.0'}
      minHeight={makeSize(BASEINPUT_DEFAULT_HEIGHT)}
      display="flex"
      flexDirection="row"
      maxHeight={makeSize(BASEINPUT_WRAPPER_MAX_HEIGHT)}
      flex="1"
      onLayout={(e) => {
        if (maxTagRows !== 'multiple') {
          return;
        }

        const containerWidth = e.nativeEvent?.layout;
        if (!containerWidth) {
          return;
        }

        const availableTagsSpace = containerWidth - PLUS_X_MORE_TEXT_WIDTH;
        const visibleTagsCount = Math.floor(availableTagsSpace / 140);
        setVisibleTags(visibleTagsCount);
      }}
    >
      <ScrollableTagSlotContainer
        maxTagRows={maxTagRows}
        showAllTags={showAllTags}
        handleOnClick={handleOnClick}
      >
        {hasTags ? (showAllTags ? tags : tags.slice(0, visibleTags)) : null}
        {hasTags && invisibleTagsCount > 0 && !showAllTags ? (
          <RNText
            onPress={() => {
              handleOnClick?.({ name: '', value: '' });
            }}
            style={{ alignSelf: 'center' }}
          >
            +{invisibleTagsCount} More
          </RNText>
        ) : null}
        <BaseBox width={hasTags && renderAs === 'button' ? makeSize(size['1']) : '100%'}>
          {children}
        </BaseBox>
      </ScrollableTagSlotContainer>
    </BaseBox>
  );
};

export { BaseInputTagSlot };
