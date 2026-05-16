import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ContactlessPaymentIcon from './';

describe('<ContactlessPaymentIcon />', () => {
  it('should render ContactlessPaymentIcon', () => {
    const { container } = renderWithTheme(
      <ContactlessPaymentIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
