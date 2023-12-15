import DownloadIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<DownloadIcon />', () => {
  it('should render DownloadIcon', () => {
    const { container } = renderWithTheme(
      <DownloadIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
