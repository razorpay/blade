import Rect from '..';
import Svg from '../../Svg';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Rect />', () => {
  it('should render react-native-svg Rect component', () => {
    const renderTree = renderWithTheme(
      <Svg width="400" height="110" viewBox="0 0 100 100">
        <Rect width="200" height="100" x="10" y="10" rx="4" ry="4" />
      </Svg>,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
