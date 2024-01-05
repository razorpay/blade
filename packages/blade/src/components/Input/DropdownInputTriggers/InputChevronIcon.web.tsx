import type { SelectChevronIconProps } from './types';
import { Chevron } from './Chevron';
import BaseBox from '~components/Box/BaseBox';
const InputChevronIcon = (props: SelectChevronIconProps): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      height="100%"
      justifyContent="center"
      alignItems="center"
      onClick={props.onClick}
    >
      <Chevron isOpen={props.isOpen} isDisabled={props.isDisabled} />
    </BaseBox>
  );
};

export { InputChevronIcon };
