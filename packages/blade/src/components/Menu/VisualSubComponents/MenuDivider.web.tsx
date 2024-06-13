import type { StyledPropsBlade } from '~components/Box/styledProps';
import { Divider } from '~components/Divider';

const MenuDivider = (styledProps: StyledPropsBlade): React.ReactElement => {
  return <Divider marginLeft="-8px" marginY="spacing.1" marginRight="-8px" {...styledProps} />;
};

export { MenuDivider };
