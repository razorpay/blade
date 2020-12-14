import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import ScrollView from '../index';

describe('<ScrollView />', () => {
  test('should match snapshot for ScrollView', () => {
    const { container } = renderWithTheme(<ScrollView />);
    expect(container).toMatchSnapshot();
  });
});
