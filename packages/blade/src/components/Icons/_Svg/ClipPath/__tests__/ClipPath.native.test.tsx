import ClipPath from '..';
import Path from '../../Path';
import Svg from '../../Svg';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ClipPath />', () => {
  it('should render react-native-svg ClipPath component', () => {
    const renderTree = renderWithTheme(
      <Svg viewBox="0 0 6 6" height="40px" width="40px" fill="none">
        <ClipPath id="clip0">
          <Path d="M2 2h2v2H2V2" fill="#000" />
        </ClipPath>
      </Svg>,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
