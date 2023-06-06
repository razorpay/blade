/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { BaseHeaderProps } from '../BaseHeaderFooter/BaseHeader';
import { useModalContext } from './ModalContext';
import { MetaConstants, assignWithoutSideEffects, makeSize } from '~utils';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';

type ModalHeaderProps = Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'trailing' | 'titleSuffix'
>;

const _ModalHeader = ({
  leading,
  subtitle,
  title,
  titleSuffix,
  trailing,
}: ModalHeaderProps): React.ReactElement => {
  const { close, defaultInitialFocusRef } = useModalContext();

  return (
    <BaseHeader
      metaDataComponentName={MetaConstants.ModalHeader}
      title={title}
      subtitle={subtitle}
      leading={leading}
      trailing={trailing}
      titleSuffix={titleSuffix}
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
