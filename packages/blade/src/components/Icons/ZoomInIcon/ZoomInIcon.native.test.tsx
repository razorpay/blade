import ZoomInIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ZoomInIcon />', () => {
  it('should render ZoomInIcon', () => {
    const renderTree = renderWithTheme(
      <ZoomInIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
