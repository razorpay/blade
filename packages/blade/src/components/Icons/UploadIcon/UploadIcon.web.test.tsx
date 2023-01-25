import UploadIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<UploadIcon />', () => {
  it('should render UploadIcon', () => {
    const { container } = renderWithTheme(
      <UploadIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
