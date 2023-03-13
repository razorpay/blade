import type { CodeProps } from '../Typography';
import { Code } from '../Typography';
import { useListContext } from './ListContext';
import { listItemCodeSize } from './listTokens';

type ListItemCodeProps = Exclude<CodeProps, 'size'>;

const ListItemCode = ({ children, testID }: ListItemCodeProps): React.ReactElement => {
  const { size } = useListContext();

  return <Code size={listItemCodeSize[size]} children={children} testID={testID} />;
};

ListItemCode.componentId = 'ListItemCode';

export { ListItemCode, ListItemCodeProps };
