import DownloadCloudIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<DownloadCloudIcon />', () => {
  it('should render DownloadCloudIcon', () => {
    const renderTree = renderWithTheme(
      <DownloadCloudIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
