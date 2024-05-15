import FileZipIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FileZipIcon />', () => {
  it('should render FileZipIcon', () => {
    const { container } = renderWithTheme(
      <FileZipIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
