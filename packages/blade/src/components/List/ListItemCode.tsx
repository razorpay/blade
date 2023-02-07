import type { CodeProps } from '../Typography';
import { Code } from '../Typography';
import { useListContext } from './ListContext';
import { listItemCodeSize } from './listTokens';

type ListItemCodeProps = Exclude<CodeProps, 'size' | 'variant' | 'isDisabled'>;

const ListItemCode = ({ children }: ListItemCodeProps): React.ReactElement => {
  const { size } = useListContext();

  return <Code size={listItemCodeSize[size]} children={children} />;
};

ListItemCode.componentId = 'ListItemCode';

export { ListItemCode, ListItemCodeProps };
