import PettyCashBudgetFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PettyCashBudgetFilledIcon />', () => {
  it('should render PettyCashBudgetFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PettyCashBudgetFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
