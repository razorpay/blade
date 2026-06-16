import UserFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<UserFilledIcon />', () => {
  it('should render UserFilledIcon', () => {
    const renderTree = renderWithTheme(
      <UserFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
