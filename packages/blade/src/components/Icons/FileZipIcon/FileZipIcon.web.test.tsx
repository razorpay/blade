import FileZipIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FileZipIcon />', () => {
  it('should render FileZipIcon', () => {
    const { container } = renderWithTheme(
      <FileZipIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
