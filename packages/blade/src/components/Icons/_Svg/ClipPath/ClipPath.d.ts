import type { ReactElement, ComponentType } from 'react';

export type ClipPathProps = {
  children: ReactElement | ReactElement[];
  id: string;
};

const ClipPath: ComponentType<ClipPathProps>;

export default ClipPath;
