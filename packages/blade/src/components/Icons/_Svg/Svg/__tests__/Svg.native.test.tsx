import Svg from '..';
import renderWithTheme from '../../../../../_helpers/testing/renderWithTheme.native';
import Path from '../../Path';

describe('<Svg />', () => {
  it('should render react-native-svg Svg component', () => {
    const renderTree = renderWithTheme(
      <Svg height="20px" width="20px" viewBox="0 0 24 24" fill="none">
        <Path d="M2 2h2v2H2V2" fill="#000" />
      </Svg>,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
