import InternationalPaymentsFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<InternationalPaymentsFilledIcon />', () => {
  it('should render InternationalPaymentsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <InternationalPaymentsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
