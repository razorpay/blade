import { listItemCodeSize } from './listTokens';
import { useListContext } from './ListContext';
import type { CodeProps } from '~components/Typography';
import { Code } from '~components/Typography';
import { MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

type ListItemCodeProps = Exclude<CodeProps, 'size'>;

const _ListItemCode = ({ children, testID }: ListItemCodeProps): React.ReactElement => {
  const { size } = useListContext();

  return <Code size={listItemCodeSize[size]} children={children} testID={testID} />;
};

const ListItemCode = assignWithoutSideEffects(_ListItemCode, {
  componentId: MetaConstants.ListItemCode,
});

export { ListItemCode, ListItemCodeProps };
