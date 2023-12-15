import ExportIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ExportIcon />', () => {
  it('should render ExportIcon', () => {
    const { container } = renderWithTheme(
      <ExportIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
