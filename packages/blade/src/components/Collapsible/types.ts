import type { ReactNode } from 'react';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { TestID } from '~utils/types';

type CollapsibleBodyProps = {
  children: ReactNode;
  width?: BaseBoxProps['width'];
  /**
   * Internal
   *
   * Set to false to remove margin of CollapsibleBody
   */
  _hasMargin?: boolean;
} & TestID;

type CollapsibleBodyContentProps = {
  children: ReactNode;
  _hasMargin?: CollapsibleBodyProps['_hasMargin'];
};

export type { CollapsibleBodyProps, CollapsibleBodyContentProps };
