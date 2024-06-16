import AppStoreIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AppStoreIcon />', () => {
  it('should render AppStoreIcon', () => {
    const renderTree = renderWithTheme(
      <AppStoreIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
