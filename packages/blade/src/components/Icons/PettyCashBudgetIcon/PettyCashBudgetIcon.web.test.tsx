import PettyCashBudgetIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PettyCashBudgetIcon />', () => {
  it('should render PettyCashBudgetIcon', () => {
    const { container } = renderWithTheme(
      <PettyCashBudgetIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
