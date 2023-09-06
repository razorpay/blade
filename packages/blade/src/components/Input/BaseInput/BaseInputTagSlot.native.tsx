import React from 'react';
import { ScrollView, Text as RNText, TouchableWithoutFeedback, View } from 'react-native';
import type { BaseInputTagSlotProps } from './types';
import { BASEINPUT_DEFAULT_HEIGHT, BASEINPUT_WRAPPER_MAX_HEIGHT } from './baseInputConfig';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils';
import { size } from '~tokens/global';

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
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{
        flexWrap: maxTagRows === 'single' ? 'nowrap' : 'wrap',
        position: 'relative',
        flexDirection: 'row',
      }}
      onScrollBeginDrag={() => {
        setIsScrolling(true);
      }}
      onScrollEndDrag={() => {
        setIsScrolling(false);
      }}
      horizontal={maxTagRows === 'single'}
      showsHorizontalScrollIndicator={maxTagRows === 'single'}
      onContentSizeChange={() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }}
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
    </ScrollView>
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
      position="relative"
      // maxHeight={makeSize(
      //   maxTagRows === 'single' ? BASEINPUT_DEFAULT_HEIGHT : BASEINPUT_WRAPPER_MAX_HEIGHT,
      // )}
      flex="1"
      onLayout={(e) => {
        if (!hasTags) return;

        if (maxTagRows === 'multiple') {
          // The calculation is for single-line versions.
          // In multiline, we have default 6 tags in RN
          return;
        }

        const containerWidth = e.nativeEvent?.layout?.width;
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
        {hasTags
          ? showAllTags || maxTagRows === 'multiple'
            ? tags
            : tags.slice(0, visibleTags)
          : null}
        {hasTags && invisibleTagsCount > 0 && !showAllTags && maxTagRows !== 'multiple' ? (
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
      <TouchableWithoutFeedback
        onPress={() => {
          handleOnClick?.({ name: '', value: '' });
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        />
      </TouchableWithoutFeedback>
    </BaseBox>
  );
};

export { BaseInputTagSlot };
