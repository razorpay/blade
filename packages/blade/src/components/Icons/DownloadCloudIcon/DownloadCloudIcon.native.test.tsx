import DownloadCloudIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<DownloadCloudIcon />', () => {
  it('should render DownloadCloudIcon', () => {
    const renderTree = renderWithTheme(
      <DownloadCloudIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
