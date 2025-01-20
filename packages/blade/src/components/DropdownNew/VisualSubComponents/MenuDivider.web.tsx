import { getDividerMarginTokens } from '../tokens';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { Divider } from '~components/Divider';
import { useTheme } from '~utils';

const DropdownDivider = (styledProps: StyledPropsBlade): React.ReactElement => {
  const { theme } = useTheme();
  return <Divider {...getDividerMarginTokens(theme)} {...styledProps} />;
};

export { DropdownDivider };
