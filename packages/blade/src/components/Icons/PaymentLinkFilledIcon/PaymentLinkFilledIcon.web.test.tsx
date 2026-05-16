import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PaymentLinkFilledIcon from './';

describe('<PaymentLinkFilledIcon />', () => {
  it('should render PaymentLinkFilledIcon', () => {
    const { container } = renderWithTheme(
      <PaymentLinkFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
