import React from 'react';
import Svg from '..';
import renderWithTheme from '../../../../../_helpers/testing/renderWithTheme.native';

describe('<Svg />', () => {
  it('should render react-native-svg Svg component', () => {
    const renderTree = renderWithTheme(
      <Svg height="20px" width="20px" viewBox="0 0 24 24" fill="none" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
