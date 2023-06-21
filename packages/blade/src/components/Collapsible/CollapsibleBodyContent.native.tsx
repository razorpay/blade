import type { ReactElement, ReactNode } from 'react';
import { Text } from '~components/Typography';

// TODO: implement
type CollapsibleBodyContentProps = {
  children: ReactNode;
};

const CollapsibleBodyContent = ({ children }: CollapsibleBodyContentProps): ReactElement => (
  <Text>To implement {children}</Text>
);

export { CollapsibleBodyContent };
