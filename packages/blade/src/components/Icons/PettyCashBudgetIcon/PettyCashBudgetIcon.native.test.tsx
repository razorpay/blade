import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PettyCashBudgetIcon from '.';

describe('<PettyCashBudgetIcon />', () => {
  it('should render PettyCashBudgetIcon', () => {
    const renderTree = renderWithTheme(
      <PettyCashBudgetIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
