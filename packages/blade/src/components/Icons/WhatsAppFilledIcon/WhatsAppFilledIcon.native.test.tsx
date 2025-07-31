import WhatsAppFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<WhatsAppFilledIcon />', () => {
  it('should render WhatsAppFilledIcon', () => {
    const renderTree = renderWithTheme(
      <WhatsAppFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
