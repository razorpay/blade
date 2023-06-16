import type { ReactElement, ReactNode } from 'react';
import { CollapsiblePanel } from './CollapsiblePanel';

type CollapsibleBodyProps = {
  children: ReactNode;
};

const CollapsibleBody = ({ children }: CollapsibleBodyProps): ReactElement => {
  return <CollapsiblePanel>{children}</CollapsiblePanel>;
};

export { CollapsibleBody, CollapsibleBodyProps };
