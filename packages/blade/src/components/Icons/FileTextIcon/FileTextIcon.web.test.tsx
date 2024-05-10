import FileTextIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FileTextIcon />', () => {
  it('should render FileTextIcon', () => {
    const { container } = renderWithTheme(
      <FileTextIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
