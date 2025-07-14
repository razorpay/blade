import WhatsAppIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<WhatsAppIcon />', () => {
  it('should render WhatsAppIcon', () => {
    const renderTree = renderWithTheme(
      <WhatsAppIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
