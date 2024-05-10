import TaxPaymentsIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TaxPaymentsIcon />', () => {
  it('should render TaxPaymentsIcon', () => {
    const renderTree = renderWithTheme(
      <TaxPaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
