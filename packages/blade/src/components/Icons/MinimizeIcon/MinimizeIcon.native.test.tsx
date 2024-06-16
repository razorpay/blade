import MinimizeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MinimizeIcon />', () => {
  it('should render MinimizeIcon', () => {
    const renderTree = renderWithTheme(
      <MinimizeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
