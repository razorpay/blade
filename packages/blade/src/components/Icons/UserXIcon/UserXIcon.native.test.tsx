import UserXIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<UserXIcon />', () => {
  it('should render UserXIcon', () => {
    const renderTree = renderWithTheme(
      <UserXIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
