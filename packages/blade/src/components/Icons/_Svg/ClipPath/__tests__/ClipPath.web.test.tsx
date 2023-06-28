import ClipPath from '..';
import Path from '../../Path';
import Svg from '../../Svg';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ClipPath />', () => {
  it('should render html clipPath component', () => {
    const { container } = renderWithTheme(
      <Svg viewBox="0 0 6 6" height="40px" width="40px" fill="none">
        <ClipPath id="clip0">
          <Path d="M2 2h2v2H2V2" fill="#000" />
        </ClipPath>
      </Svg>,
    );
    expect(container).toMatchSnapshot();
  });
});
