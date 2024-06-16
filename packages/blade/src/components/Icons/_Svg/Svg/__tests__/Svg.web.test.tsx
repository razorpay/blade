import Svg from '..';
import Path from '../../Path';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Svg />', () => {
  it('should render html svg component', () => {
    const { container } = renderWithTheme(
      <Svg height="20px" width="20px" viewBox="0 0 24 24" fill="none">
        <Path d="M2 2h2v2H2V2" fill="#000" />
      </Svg>,
    );
    expect(container).toMatchSnapshot();
  });
});
