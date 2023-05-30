import { useModalContext } from './ModalContext';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';

type ModalHeaderProps = BaseHeaderProps;

const ModalHeader = (props: ModalHeaderProps): React.ReactElement => {
  const { close, defaultInitialFocusRef } = useModalContext();
  return (
    <BaseHeader
      title={props.title}
      subtitle={props.subtitle}
      leading={props.leading}
      trailing={props.trailing}
      titleSuffix={props.titleSuffix}
      closeButtonRef={defaultInitialFocusRef}
      showCloseButton={true}
      onCloseButtonClick={close}
    />
  );
};

export { ModalHeader };
export type { ModalHeaderProps };
