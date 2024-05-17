import MapIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MapIcon />', () => {
  it('should render MapIcon', () => {
    const renderTree = renderWithTheme(
      <MapIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
