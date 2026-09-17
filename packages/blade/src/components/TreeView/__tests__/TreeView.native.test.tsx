import React from 'react';
import { TreeView, TreeViewItem, TreeViewLoadMore } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<TreeView />', () => {
  it('<TreeView /> should throw error on native', () => {
    expect(() =>
      renderWithTheme(
        <TreeView>
          <TreeViewItem title="Goa" value="goa" />
        </TreeView>,
      ),
    ).toThrow('[Blade: TreeView]: TreeView is not available on React Native');
  });

  it('<TreeViewItem /> should throw error on native', () => {
    expect(() => renderWithTheme(<TreeViewItem title="Goa" value="goa" />)).toThrow(
      '[Blade: TreeView]: TreeViewItem is not available on React Native',
    );
  });

  it('<TreeViewLoadMore /> should throw error on native', () => {
    expect(() => renderWithTheme(<TreeViewLoadMore onClick={jest.fn()} />)).toThrow(
      '[Blade: TreeView]: TreeViewLoadMore is not available on React Native',
    );
  });
});
