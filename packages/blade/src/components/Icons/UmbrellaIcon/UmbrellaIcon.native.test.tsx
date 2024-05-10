import UmbrellaIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<UmbrellaIcon />', () => {
  it('should render UmbrellaIcon', () => {
    const renderTree = renderWithTheme(
      <UmbrellaIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
