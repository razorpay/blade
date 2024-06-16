import LogOutIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<LogOutIcon />', () => {
  it('should render LogOutIcon', () => {
    const renderTree = renderWithTheme(
      <LogOutIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
