import type { TreeViewItemProps, TreeViewLoadMoreProps, TreeViewProps } from './types';

const TreeView = (_props: TreeViewProps): never => {
  throw new Error('[Blade: TreeView]: TreeView is not available on React Native');
};

const TreeViewItem = (_props: TreeViewItemProps): never => {
  throw new Error('[Blade: TreeView]: TreeViewItem is not available on React Native');
};

const TreeViewLoadMore = (_props: TreeViewLoadMoreProps): never => {
  throw new Error('[Blade: TreeView]: TreeViewLoadMore is not available on React Native');
};

export { TreeView, TreeViewItem, TreeViewLoadMore };
