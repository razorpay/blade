import ExportIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ExportIcon />', () => {
  it('should render ExportIcon', () => {
    const { container } = renderWithTheme(
      <ExportIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
