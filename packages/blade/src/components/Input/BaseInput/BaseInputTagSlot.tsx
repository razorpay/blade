import React from 'react';
import type { BaseInputProps } from './BaseInput';
import type { StyledBaseInputProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { isReactNative } from '~utils';

type BaseInputTagSlotProps = {
  tags?: BaseInputProps['tags'];
  setFocusOnInput: () => void;
  setShouldIgnoreBlurAnimation: BaseInputProps['setShouldIgnoreBlurAnimation'];
  handleOnClick: StyledBaseInputProps['handleOnClick'];
  isMultiline: BaseInputProps['isMultiline'];
};

const BaseInputTagSlot = ({
  tags,
  setShouldIgnoreBlurAnimation,
  setFocusOnInput,
  handleOnClick,
  isMultiline,
}: BaseInputTagSlotProps): React.ReactElement | null => {
  const tagContainerRef = React.useRef<HTMLDivElement>(null);

  // React.useEffect(() => {
  //   console.log(tagContainerRef.current?.clientWidth, tagContainerRef.current?.clientHeight);
  // }, [tags]);

  if (!tags) {
    return null;
  }

  if (tags.length <= 0) {
    return null;
  }

  return (
    <BaseBox
      ref={tagContainerRef}
      paddingLeft="spacing.4"
      marginY="spacing.2"
      justifyContent="flex-start"
      display="flex"
      flexDirection="row"
      // switch to these on `props.rows` value
      flexWrap={isMultiline ? 'wrap' : 'nowrap'}
      whiteSpace={isMultiline ? undefined : 'nowrap'}
      overflow="auto"
      // @todo fix this to use token
      maxHeight="100px"
      // Move to using gap instead of marginLeft on individual tags after RN upgrade
      // gap="spacing.3"
      {...(!isReactNative()
        ? {
            onMouseDown: () => {
              setShouldIgnoreBlurAnimation?.(true);
            },
            onClick: (e) => {
              if (tagContainerRef.current === e.target) {
                handleOnClick?.({ name: '', value: e as React.MouseEvent<HTMLInputElement> });
              }
              setFocusOnInput();
            },
            onMouseUp: () => {
              setShouldIgnoreBlurAnimation?.(false);
            },
          }
        : {})}
    >
      {tags}
    </BaseBox>
  );
};

export { BaseInputTagSlot };
