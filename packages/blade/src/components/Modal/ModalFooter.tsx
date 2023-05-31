import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import { MetaConstants, assignWithoutSideEffects } from '~utils';

type ModalFooterProps = BaseFooterProps;

const _ModalFooter = (props: ModalFooterProps): React.ReactElement => {
  return (
    <BaseFooter
      metaDataComponentName={MetaConstants.ModalFooter}
      children={props.children}
      showDivider={props.showDivider}
    />
  );
};

const ModalFooter = assignWithoutSideEffects(_ModalFooter, {
  componentId: MetaConstants.ModalFooter,
});

export { ModalFooter };
export type { ModalFooterProps };
