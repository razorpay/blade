import FileTextIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<FileTextIcon />', () => {
  it('should render FileTextIcon', () => {
    const { container } = renderWithTheme(
      <FileTextIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
