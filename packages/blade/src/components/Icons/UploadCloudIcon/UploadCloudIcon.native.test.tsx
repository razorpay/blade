import renderWithTheme from '~utils/testing/renderWithTheme.native';

import UploadCloudIcon from '.';

describe('<UploadCloudIcon />', () => {
  it('should render UploadCloudIcon', () => {
    const renderTree = renderWithTheme(
      <UploadCloudIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
