import type { ReactElement, ReactNode } from 'react';
import { useCollapsibleContext } from './CollapsibleContext';
import { BaseBox } from '~components/Box/BaseBox';

type CollapsibleBodyProps = {
  children: ReactNode;
};

const CollapsibleBody = ({ children }: CollapsibleBodyProps): ReactElement => {
  const { isExpanded } = useCollapsibleContext();

  return isExpanded ? (
    <BaseBox>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio blanditiis expedita, dolorum
      aliquid, iste inventore, quidem cupiditate perspiciatis saepe voluptates atque eos est nostrum
      ad. Sed excepturi laudantium libero placeat.
      {children}
    </BaseBox>
  ) : null;
};

export { CollapsibleBody, CollapsibleBodyProps };
