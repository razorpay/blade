import renderWithTheme from '~utils/testing/renderWithTheme.native';

import DownloadCloudIcon from '.';

describe('<DownloadCloudIcon />', () => {
  it('should render DownloadCloudIcon', () => {
    const renderTree = renderWithTheme(
      <DownloadCloudIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
