import UserPlusIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<UserPlusIcon />', () => {
  it('should render UserPlusIcon', () => {
    const renderTree = renderWithTheme(
      <UserPlusIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
