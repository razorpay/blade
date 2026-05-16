import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BankIcon from '.';

describe('<BankIcon />', () => {
  it('should render CloseIcon', () => {
    const { container } = renderWithTheme(
      <BankIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
