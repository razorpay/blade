import PayrollForStartupOrSmeFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PayrollForStartupOrSmeFilledIcon />', () => {
  it('should render PayrollForStartupOrSmeFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PayrollForStartupOrSmeFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
