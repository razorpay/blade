import WhatsAppFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<WhatsAppFilledIcon />', () => {
  it('should render WhatsAppFilledIcon', () => {
    const { container } = renderWithTheme(
      <WhatsAppFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
