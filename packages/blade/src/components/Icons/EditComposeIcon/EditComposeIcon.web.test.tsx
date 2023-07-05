import EditComposeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<EditComposeIcon />', () => {
  it('should render EditComposeIcon', () => {
    const { container } = renderWithTheme(
      <EditComposeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
