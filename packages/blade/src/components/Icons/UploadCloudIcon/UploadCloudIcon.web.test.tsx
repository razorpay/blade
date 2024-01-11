import UploadCloudIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UploadCloudIcon />', () => {
  it('should render UploadCloudIcon', () => {
    const { container } = renderWithTheme(
      <UploadCloudIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
