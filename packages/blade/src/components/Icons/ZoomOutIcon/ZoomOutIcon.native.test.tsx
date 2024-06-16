import ZoomOutIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ZoomOutIcon />', () => {
  it('should render ZoomOutIcon', () => {
    const renderTree = renderWithTheme(
      <ZoomOutIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
