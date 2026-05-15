import renderWithTheme from '~utils/testing/renderWithTheme.native';

import WhatsAppIcon from '.';

describe('<WhatsAppIcon />', () => {
  it('should render WhatsAppIcon', () => {
    const renderTree = renderWithTheme(
      <WhatsAppIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
