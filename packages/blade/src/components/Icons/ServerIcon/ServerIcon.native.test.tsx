import ServerIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ServerIcon />', () => {
  it('should render ServerIcon', () => {
    const renderTree = renderWithTheme(
      <ServerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
