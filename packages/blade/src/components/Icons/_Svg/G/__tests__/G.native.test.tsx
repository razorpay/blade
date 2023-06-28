import G from '..';
import Path from '../../Path';
import Svg from '../../Svg';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<G />', () => {
  it('should render react-native-svg G component', () => {
    const renderTree = renderWithTheme(
      <Svg viewBox="0 0 6 6" height="40px" width="40px" fill="none">
        <G clipPath="url(#prefix__clip0)">
          <Path d="M2 2h2v2H2V2" fill="#000" />
        </G>
      </Svg>,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
