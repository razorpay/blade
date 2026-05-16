import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';

import { useBottomSheetContext } from './BottomSheetContext';

const BottomSheetCloseButton = (): React.ReactElement => {
  const { close, defaultInitialFocusRef } = useBottomSheetContext();

  return (
    <IconButton
      ref={defaultInitialFocusRef}
      size="large"
      icon={CloseIcon}
      accessibilityLabel="Close"
      onClick={() => close?.()}
    />
  );
};

export { BottomSheetCloseButton };
