import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PaymentPagesFilledIcon from './';

describe('<PaymentPagesFilledIcon />', () => {
  it('should render PaymentPagesFilledIcon', () => {
    const { container } = renderWithTheme(
      <PaymentPagesFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
