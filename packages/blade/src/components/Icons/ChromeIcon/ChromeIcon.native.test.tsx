import ChromeIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ChromeIcon />', () => {
  it('should render ChromeIcon', () => {
    const renderTree = renderWithTheme(
      <ChromeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
