import type { CodeProps } from '../Typography';
import { Code } from '../Typography';
import { useListContext } from './ListContext';
import { listItemCodeSize } from './listTokens';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

type ListItemCodeProps = Exclude<CodeProps, 'size'>;

const _ListItemCode = ({ children, testID }: ListItemCodeProps): React.ReactElement => {
  const { size } = useListContext();

  return <Code size={listItemCodeSize[size]} children={children} testID={testID} />;
};

const ListItemCode = assignWithoutSideEffects(_ListItemCode, { componentId: 'ListItemCode' });

export { ListItemCode, ListItemCodeProps };
