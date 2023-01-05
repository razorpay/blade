import UserIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<UserIcon />', () => {
  it('should render UserIcon', () => {
    const renderTree = renderWithTheme(
      <UserIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
