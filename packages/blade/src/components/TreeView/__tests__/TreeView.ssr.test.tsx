import React from 'react';
import { TreeView, TreeViewItem, TreeViewLoadMore } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<TreeView />', () => {
  it('should render standalone tree on server', () => {
    const { container, getByRole, getAllByRole } = renderWithSSR(
      <TreeView selectionType="multiple">
        <TreeViewItem title="India" value="india" defaultIsExpanded>
          <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
            <TreeViewItem title="Bengaluru" value="bengaluru" />
            <TreeViewItem title="Mysuru" value="mysuru" />
            <TreeViewLoadMore onClick={jest.fn()} />
          </TreeViewItem>
          <TreeViewItem title="Goa" value="goa" />
        </TreeViewItem>
      </TreeView>,
    );

    expect(getByRole('tree')).toBeInTheDocument();
    expect(getAllByRole('treeitem')).toHaveLength(6);
    expect(container).toMatchSnapshot();
  });
});
