import UploadCloudIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<UploadCloudIcon />', () => {
  it('should render UploadCloudIcon', () => {
    const renderTree = renderWithTheme(
      <UploadCloudIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
