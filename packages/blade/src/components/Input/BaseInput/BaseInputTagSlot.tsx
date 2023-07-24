import type { BaseInputProps } from './BaseInput';
import BaseBox from '~components/Box/BaseBox';
import { isReactNative } from '~utils';

type BaseInputTagSlotProps = {
  tags?: BaseInputProps['tags'];
  setFocusOnInput: () => void;
  setShouldIgnoreBlurAnimation: BaseInputProps['setShouldIgnoreBlurAnimation'];
};

const BaseInputTagSlot = ({
  tags,
  setShouldIgnoreBlurAnimation,
  setFocusOnInput,
}: BaseInputTagSlotProps): React.ReactElement | null => {
  if (!tags) {
    return null;
  }

  if (tags.length <= 0) {
    return null;
  }

  return (
    <BaseBox
      paddingLeft="spacing.4"
      alignSelf="center"
      justifyContent="center"
      display="flex"
      flexDirection="row"
      gap="spacing.3"
      {...(!isReactNative()
        ? {
            onMouseDown: () => {
              setShouldIgnoreBlurAnimation?.(true);
            },
            onClick: () => {
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
