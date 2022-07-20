import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import DownloadIcon from '.';

describe('<DownloadIcon />', () => {
  it('should render DownloadIcon', () => {
    const { container } = renderWithTheme(
      <DownloadIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
