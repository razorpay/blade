import MailIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<EmailIcon />', () => {
  it('should render EmailIcon', () => {
    const renderTree = renderWithTheme(
      <EmailIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
