import { usePopoverContext } from './PopoverContext';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';

const PopoverCloseButton = (): React.ReactElement => {
  const { close, defaultInitialFocusRef } = usePopoverContext();

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

export { PopoverCloseButton };
