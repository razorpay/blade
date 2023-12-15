import PackageIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PackageIcon />', () => {
  it('should render PackageIcon', () => {
    const renderTree = renderWithTheme(
      <PackageIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
