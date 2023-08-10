import type { SelectChevronIconProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';

const SelectChevronIcon = (props: SelectChevronIconProps): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      height="100%"
      justifyContent="center"
      alignItems="center"
      onClick={props.onClick}
    >
      <ChevronDownIcon
        display={props.isOpen ? 'none' : 'flex'}
        color="surface.text.normal.lowContrast"
        size="medium"
      />
      <ChevronUpIcon
        display={props.isOpen ? 'flex' : 'none'}
        color="surface.text.normal.lowContrast"
        size="medium"
      />
    </BaseBox>
  );
};

export { SelectChevronIcon };
