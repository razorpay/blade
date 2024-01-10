import { useBottomSheetContext } from './BottomSheetContext';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';

const BottomSheetCloseButton = (): React.ReactElement => {
  const { close, defaultInitialFocusRef } = useBottomSheetContext();

  return (
    <IconButton
      ref={defaultInitialFocusRef}
      size="large"
      icon={CloseIcon}
      accessibilityLabel="Close"
      onClick={close}
    />
  );
};

export { BottomSheetCloseButton };
