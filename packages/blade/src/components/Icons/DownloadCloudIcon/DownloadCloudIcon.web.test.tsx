import DownloadCloudIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<DownloadCloudIcon />', () => {
  it('should render DownloadCloudIcon', () => {
    const { container } = renderWithTheme(
      <DownloadCloudIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
