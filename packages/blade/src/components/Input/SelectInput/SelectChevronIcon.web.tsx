import type { SelectChevronIconProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const SelectChevronIcon = (props: SelectChevronIconProps): React.ReactElement => {
  const Icon = props.icon;
  return (
    <BaseBox as="div" display="flex" justifyContent="center" onClick={props.onClick}>
      <Icon color="surface.text.normal.lowContrast" size="medium" />
    </BaseBox>
  );
};

export { SelectChevronIcon };
