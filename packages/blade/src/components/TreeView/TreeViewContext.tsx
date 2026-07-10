import { createContext, useContext } from 'react';
import type { TreeViewContextType } from './types';
import { throwBladeError } from '~utils/logger';

const TreeViewContext = createContext<TreeViewContextType | null>(null);

const useTreeView = (): TreeViewContextType => {
  const ctx = useContext(TreeViewContext);
  if (__DEV__) {
    if (!ctx) {
      throwBladeError({
        message: 'TreeViewItem must be used inside TreeView',
        moduleName: 'TreeViewContext',
      });
    }
  }
  return ctx!;
};

export { TreeViewContext, useTreeView };
