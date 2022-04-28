import React from 'react';
import Defs from '..';
import renderWithTheme from '../../../../../_helpers/testing/renderWithTheme.native';
import Path from '../../Path';
import Svg from '../../Svg';

describe('<Defs />', () => {
  it('should render react-native-svg Defs component', () => {
    const renderTree = renderWithTheme(
      <Svg viewBox="0 0 6 6" height="40px" width="40px" fill="none">
        <Defs>
          <Path d="M2 2h2v2H2V2" fill="#000" />
        </Defs>
      </Svg>,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
