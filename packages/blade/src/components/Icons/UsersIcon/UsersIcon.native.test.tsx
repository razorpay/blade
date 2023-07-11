import UsersIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<UsersIcon />', () => {
  it('should render UsersIcon', () => {
    const renderTree = renderWithTheme(
      <UsersIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
