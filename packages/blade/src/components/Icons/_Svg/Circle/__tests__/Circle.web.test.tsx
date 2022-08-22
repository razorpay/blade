import Circle from '..';
import Svg from '../../Svg';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Circle />', () => {
  it('should render html circle component', () => {
    const { container } = renderWithTheme(
      <Svg width="400" height="110" viewBox="0 0 100 100">
        <Circle cx="200" cy="100" x="10" y="10" r="4" />
      </Svg>,
    );
    expect(container).toMatchSnapshot();
  });
});
