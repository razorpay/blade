import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PaymentLinksIcon from './';

describe('<PaymentLinksIcon />', () => {
  it('should render PaymentLinksIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentLinksIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
