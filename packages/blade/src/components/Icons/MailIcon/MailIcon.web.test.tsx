import EmailIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<EmailIcon />', () => {
  it('should render EmailIcon', () => {
    const { container } = renderWithTheme(
      <EmailIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
