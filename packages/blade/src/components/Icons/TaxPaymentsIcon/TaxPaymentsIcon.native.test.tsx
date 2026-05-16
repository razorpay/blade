import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TaxPaymentsIcon from '.';

describe('<TaxPaymentsIcon />', () => {
  it('should render TaxPaymentsIcon', () => {
    const renderTree = renderWithTheme(
      <TaxPaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
