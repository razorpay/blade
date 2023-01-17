import PackageIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PackageIcon />', () => {
  it('should render PackageIcon', () => {
    const { container } = renderWithTheme(
      <PackageIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
