import DownloadIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<DownloadIcon />', () => {
  it('should render DownloadIcon', () => {
    const renderTree = renderWithTheme(
      <DownloadIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
