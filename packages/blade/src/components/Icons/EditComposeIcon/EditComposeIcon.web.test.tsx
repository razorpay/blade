import EditComposeIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<EditComposeIcon />', () => {
  it('should render EditComposeIcon', () => {
    const { container } = renderWithTheme(
      <EditComposeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
