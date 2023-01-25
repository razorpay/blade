import UploadCloudIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<UploadCloudIcon />', () => {
  it('should render UploadCloudIcon', () => {
    const { container } = renderWithTheme(
      <UploadCloudIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
