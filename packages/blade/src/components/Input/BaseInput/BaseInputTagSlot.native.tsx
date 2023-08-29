import React from 'react';
import { ScrollView, Text as RNText } from 'react-native';
import styled from 'styled-components';
import type { BaseInputTagSlotProps } from './types';
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

const BaseInputTagSlot = ({
  tags,
  maxTagRows,
  showAllTags,
  handleOnClick,
  renderAs,
  children,
}: BaseInputTagSlotProps): React.ReactElement | null => {
  const hasTags = tags && tags.length > 0;
  const visibleTags = maxTagRows === 'multiple' ? 6 : 2; // 2 tags * 3 rows = 6
  const invisibleTagsCount = tags ? tags.length - visibleTags : 0;

  return (
    <BaseBox
      marginY={hasTags ? 'spacing.1' : 'spacing.0'}
      justifyContent="flex-start"
      paddingLeft={hasTags ? 'spacing.4' : 'spacing.0'}
      minHeight={makeSize(size['36'])}
      display="flex"
      flexDirection="row"
      maxHeight={makeSize(size['100'])}
      flex="1"
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
