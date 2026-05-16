import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CreditCardIcon from './';

describe('<CreditCardIcon />', () => {
  it('should render CreditCardIcon', () => {
    const { container } = renderWithTheme(
      <CreditCardIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
