import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PettyCashBudgetIcon from './';

describe('<PettyCashBudgetIcon />', () => {
  it('should render PettyCashBudgetIcon', () => {
    const { container } = renderWithTheme(
      <PettyCashBudgetIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
