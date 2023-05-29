import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';

type ModalFooterProps = BaseFooterProps;

const ModalFooter = (props: ModalFooterProps): React.ReactElement => {
  return <BaseFooter children={props.children} showDivider={props.showDivider} />;
};

export { ModalFooter };
export type { ModalFooterProps };
