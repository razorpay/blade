import Box from '~components/Box';
import type { IconComponent } from '~components/Icons';

export type SelectChevronIconProps = {
  onClick: () => void;
  icon: IconComponent;
};

const SelectChevronIcon = (props: SelectChevronIconProps): JSX.Element => {
  const Icon = props.icon;
  return (
    <Box as="div" display="flex" justifyContent="center" onClick={props.onClick}>
      <Icon color="surface.text.normal.lowContrast" size="medium" />
    </Box>
  );
};

export { SelectChevronIcon };
