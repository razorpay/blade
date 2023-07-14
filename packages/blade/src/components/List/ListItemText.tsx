import type { ReactElement } from 'react';
import type { TextProps, TextVariant } from '../Typography';
import { Text } from '../Typography';
import { useListContext } from './ListContext';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

type ListItemTextProps = Omit<TextProps<{ variant: TextVariant }>, 'variant' | 'size'>;

const _ListItemText = ({ children, testID, ...props }: ListItemTextProps): ReactElement => {
  const { size } = useListContext();

  return <Text {...props} size={size} children={children} testID={testID} />;
};

const ListItemText = assignWithoutSideEffects(_ListItemText, { componentId: 'ListItemText' });

export { ListItemText };
