import AutomatePayrollIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AutomatePayrollIcon />', () => {
  it('should render AutomatePayrollIcon', () => {
    const renderTree = renderWithTheme(
      <AutomatePayrollIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
