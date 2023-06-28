import FileIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FileIcon />', () => {
  it('should render FileIcon', () => {
    const { container } = renderWithTheme(
      <FileIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
