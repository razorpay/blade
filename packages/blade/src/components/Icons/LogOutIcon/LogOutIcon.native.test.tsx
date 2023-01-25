import LogOutIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<LogOutIcon />', () => {
  it('should render LogOutIcon', () => {
    const renderTree = renderWithTheme(
      <LogOutIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
