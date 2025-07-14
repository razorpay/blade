import WhatsAppIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<WhatsAppIcon />', () => {
  it('should render WhatsAppIcon', () => {
    const { container } = renderWithTheme(
      <WhatsAppIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
