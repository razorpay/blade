import UserPlusIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<UserPlusIcon />', () => {
  it('should render UserPlusIcon', () => {
    const renderTree = renderWithTheme(
      <UserPlusIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
