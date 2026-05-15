import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';

import { usePopoverContext } from './PopoverContext';

const PopoverCloseButton = (): React.ReactElement => {
  const { close, defaultInitialFocusRef } = usePopoverContext();

  return (
    <IconButton
      ref={defaultInitialFocusRef as never}
      size="medium"
      icon={CloseIcon}
      accessibilityLabel="Close"
      onClick={close}
    />
  );
};

export { PopoverCloseButton };
