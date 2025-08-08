import TaxPaymentsFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TaxPaymentsFilledIcon />', () => {
  it('should render TaxPaymentsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <TaxPaymentsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
