import FileZipIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FileZipIcon />', () => {
  it('should render FileZipIcon', () => {
    const renderTree = renderWithTheme(
      <FileZipIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
