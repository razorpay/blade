import type { ReactElement } from 'react';
import { useListContext } from './ListContext';
import type { TextProps, TextVariant } from '~components/Typography';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute';

type ListItemTextProps = Omit<TextProps<{ variant: TextVariant }>, 'variant' | 'size'>;

const _ListItemText = ({ children, testID, ...props }: ListItemTextProps): ReactElement => {
  const { size } = useListContext();

  return <Text {...props} size={size} children={children} testID={testID} />;
};

const ListItemText = assignWithoutSideEffects(_ListItemText, {
  componentId: MetaConstants.ListItemText,
});

export type { ListItemTextProps };
export { ListItemText };
