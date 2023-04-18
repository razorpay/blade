import { useBottomSheetContext } from './BottomSheetContext';
import BaseBox from '~components/Box/BaseBox';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';

const BottomSheetCloseButton = (): React.ReactElement => {
  const { close, defaultInitialFocusRef } = useBottomSheetContext();
  return (
    <BaseBox
      width="28px"
      height="28px"
      minWidth="28px"
      minHeight="28px"
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
        accessibilityLabel="Close bottomsheet"
        onClick={() => close()}
      />
    </BaseBox>
  );
};

export { BottomSheetCloseButton };
