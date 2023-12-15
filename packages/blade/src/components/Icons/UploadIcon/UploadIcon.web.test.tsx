import UploadIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UploadIcon />', () => {
  it('should render UploadIcon', () => {
    const { container } = renderWithTheme(
      <UploadIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
