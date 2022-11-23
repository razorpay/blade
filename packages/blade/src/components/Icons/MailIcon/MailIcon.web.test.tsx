import MailIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MailIcon />', () => {
  it('should render MailIcon', () => {
    const { container } = renderWithTheme(
      <MailIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
