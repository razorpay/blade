import type { ReactNode } from 'react';
import type { CollapsibleBodyProps } from './CollapsibleBody';

export type CollapsibleBodyContentProps = {
  children: ReactNode;
  borderTopWidth?: CollapsibleBodyProps['_borderTopWidth'];
};
