import type { ReactElement, ReactNode } from 'react';
import { Text } from '~components/Typography';

// TODO: implement
type CollapsiblePanelProps = {
  children: ReactNode;
};

const CollapsiblePanel = ({ children }: CollapsiblePanelProps): ReactElement => (
  <Text>To implement {children}</Text>
);

export { CollapsiblePanel };
