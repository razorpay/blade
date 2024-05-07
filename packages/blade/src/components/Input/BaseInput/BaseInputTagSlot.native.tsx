import React from 'react';
import { ScrollView, TouchableWithoutFeedback } from 'react-native';
import type { BaseInputTagSlotProps } from './types';
import { baseInputHeight } from './baseInputTokens';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils';
import { size as sizeToken } from '~tokens/global';
import { Text } from '~components/Typography';
import type { StringChildrenType } from '~utils/types';

const ScrollableTagSlotContainer = ({
  maxTagRows,
  children,
  handleOnInputClick,
}: Pick<BaseInputTagSlotProps, 'maxTagRows' | 'showAllTags' | 'handleOnInputClick'> & {
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
        flexGrow: 1,
        alignItems: 'center',
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
      <TouchableWithoutFeedback
        onPress={() => {
          if (!isScrolling) {
            handleOnInputClick();
          }
        }}
      >
        <BaseBox position="absolute" height="100%" width="100%" />
      </TouchableWithoutFeedback>
      {children}
    </ScrollView>
  );
};

const ClickableText = ({
  children,
  handleOnInputClick,
  isDisabled,
}: {
  children: StringChildrenType;
  handleOnInputClick: BaseInputTagSlotProps['handleOnInputClick'];
  isDisabled: BaseInputTagSlotProps['isDisabled'];
}): React.ReactElement => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        handleOnInputClick();
      }}
    >
      <BaseBox alignSelf="center" marginRight="spacing.4">
        <Text
          size="small"
          variant="body"
          weight="regular"
          color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle'}
        >
          {children}
        </Text>
      </BaseBox>
    </TouchableWithoutFeedback>
  );
};

const PLUS_X_MORE_TEXT_WIDTH = 60;

const BaseInputTagSlot = ({
  tags,
  maxTagRows,
  showAllTags,
  handleOnInputClick,
  renderAs,
  children,
  isDropdownTrigger,
  labelPrefix,
  isDisabled,
  numberOfLines,
  isTextArea,
  size,
}: BaseInputTagSlotProps): React.ReactElement | null => {
  const hasTags = tags && tags.length > 0;
  const initialVisibleTags = maxTagRows === 'multiple' ? 6 : 1;
  const [visibleTags, setVisibleTags] = React.useState(labelPrefix ? 0 : initialVisibleTags);
  const invisibleTagsCount = tags || (tags && labelPrefix) ? tags.length - visibleTags : 0;

  if (!isDropdownTrigger) {
    return children;
  }

  return (
    <BaseBox
      justifyContent="flex-start"
      paddingY="spacing.1"
      paddingX="spacing.4"
      minHeight={makeSize(baseInputHeight[size])}
      height={
        isTextArea && isDropdownTrigger
          ? makeSize(baseInputHeight[size] * (numberOfLines ?? 1))
          : undefined
      }
      display="flex"
      flexDirection="row"
      position="relative"
      flex="1"
      onLayout={(e) => {
        if (!hasTags) return;

        if (labelPrefix) {
          setVisibleTags(0);
          return;
        }

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
        handleOnInputClick={handleOnInputClick}
      >
        {hasTags ? (
          <>
            {showAllTags || maxTagRows === 'multiple' ? tags : tags.slice(0, visibleTags)}
            {invisibleTagsCount > 0 && !showAllTags && !labelPrefix && maxTagRows !== 'multiple' ? (
              <ClickableText isDisabled={isDisabled} handleOnInputClick={handleOnInputClick}>
                + {invisibleTagsCount} More
              </ClickableText>
            ) : null}
            {!showAllTags && invisibleTagsCount > 0 && labelPrefix ? (
              <ClickableText isDisabled={isDisabled} handleOnInputClick={handleOnInputClick}>
                {labelPrefix} ({invisibleTagsCount} Selected)
              </ClickableText>
            ) : null}
          </>
        ) : null}
        <BaseBox width={hasTags && renderAs === 'button' ? makeSize(sizeToken['1']) : '100%'}>
          {children}
        </BaseBox>
      </ScrollableTagSlotContainer>
      <TouchableWithoutFeedback
        onPress={() => {
          handleOnInputClick();
        }}
      >
        <BaseBox flex="1" />
      </TouchableWithoutFeedback>
    </BaseBox>
  );
};

export { BaseInputTagSlot };
