import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PaymentLinksIcon from './';

describe('<PaymentLinksIcon />', () => {
  it('should render PaymentLinksIcon', () => {
    const { container } = renderWithTheme(
      <PaymentLinksIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
