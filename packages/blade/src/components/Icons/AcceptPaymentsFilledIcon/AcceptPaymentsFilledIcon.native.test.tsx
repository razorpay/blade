import AcceptPaymentsFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AcceptPaymentsFilledIcon />', () => {
  it('should render AcceptPaymentsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <AcceptPaymentsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
