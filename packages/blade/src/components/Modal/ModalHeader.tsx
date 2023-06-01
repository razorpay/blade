import { useModalContext } from './ModalContext';
import { MetaConstants, assignWithoutSideEffects } from '~utils';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';

type ModalHeaderProps = Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'trailing' | 'titleSuffix'
>;

const _ModalHeader = (props: ModalHeaderProps): React.ReactElement => {
  const { close, defaultInitialFocusRef } = useModalContext();
  return (
    <BaseHeader
      metaDataComponentName={MetaConstants.ModalHeader}
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
const ModalHeader = assignWithoutSideEffects(_ModalHeader, {
  componentId: MetaConstants.ModalHeader,
});

export { ModalHeader };
export type { ModalHeaderProps };
