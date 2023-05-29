/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { useModalContext } from './ModalContext';

type ModalHeaderProps = BaseHeaderProps & {
  //   close: () => void;
  defaultInitialFocusRef: React.MutableRefObject<any>;
};

const ModalHeader = (props: ModalHeaderProps): React.ReactElement => {
  const { close } = useModalContext();
  return (
    <BaseHeader
      title={props.title}
      subtitle={props.subtitle}
      leading={props.leading}
      trailing={props.trailing}
      titleSuffix={props.titleSuffix}
      closeButtonRef={props.defaultInitialFocusRef}
      showCloseButton={true}
      onCloseButtonClick={close}
    />
  );
};

export { ModalHeader };
export type { ModalHeaderProps };
