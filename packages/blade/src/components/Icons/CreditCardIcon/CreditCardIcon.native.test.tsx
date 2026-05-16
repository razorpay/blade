import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CreditCardIcon from '.';

describe('<CreditCardIcon />', () => {
  it('should render CreditCardIcon', () => {
    const renderTree = renderWithTheme(
      <CreditCardIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
