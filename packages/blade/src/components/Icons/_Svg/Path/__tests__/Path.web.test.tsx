import Path from '..';
import renderWithTheme from '../../../../../_helpers/testing/renderWithTheme.web';
import Svg from '../../Svg';

describe('<Path />', () => {
  it('should render html path component', () => {
    const { container } = renderWithTheme(
      <Svg viewBox="0 0 6 6" height="40px" width="40px" fill="none">
        <Path
          d="M2 2h2v2H2V2"
          fill="#000"
          clipPath="#id1"
          clipRule="evenodd"
          fillOpacity={0.5}
          fillRule="nonzero"
          stroke="#1212"
          strokeLinecap="square"
          strokeLinejoin="bevel"
          strokeWidth="2px"
        />
      </Svg>,
    );
    expect(container).toMatchSnapshot();
  });
});
