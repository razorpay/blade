import AutomatePayrollFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AutomatePayrollFilledIcon />', () => {
  it('should render AutomatePayrollFilledIcon', () => {
    const renderTree = renderWithTheme(
      <AutomatePayrollFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
