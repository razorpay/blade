import PayrollForCaFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PayrollForCaFilledIcon />', () => {
  it('should render PayrollForCaFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PayrollForCaFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
