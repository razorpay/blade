import { useBottomSheetContext } from './BottomSheetContext';
import BaseBox from '~components/Box/BaseBox';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';
import size from '~tokens/global/size';
import { makeSize } from '~utils';

const BottomSheetCloseButton = (): React.ReactElement => {
  const { close, defaultInitialFocusRef } = useBottomSheetContext();
  const buttonSize = makeSize(size['28']);

  return (
    <BaseBox
      width={buttonSize}
      height={buttonSize}
      minWidth={buttonSize}
      minHeight={buttonSize}
      backgroundColor="feedback.background.neutral.lowContrast"
      display="flex"
      borderRadius="max"
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top="spacing.4"
      right="spacing.4"
    >
      <IconButton
        ref={defaultInitialFocusRef}
        size="large"
        icon={CloseIcon}
        accessibilityLabel="Close"
        onClick={close}
      />
    </BaseBox>
  );
};

export { BottomSheetCloseButton };
