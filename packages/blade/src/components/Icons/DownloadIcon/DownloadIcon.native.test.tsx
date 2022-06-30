import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import DownloadIcon from '.';

describe('<DownloadIcon />', () => {
  it('should render DownloadIcon', () => {
    const renderTree = renderWithTheme(
      <DownloadIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
