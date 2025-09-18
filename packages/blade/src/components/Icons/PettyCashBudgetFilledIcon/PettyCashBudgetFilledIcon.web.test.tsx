import PettyCashBudgetFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PettyCashBudgetFilledIcon />', () => {
  it('should render PettyCashBudgetFilledIcon', () => {
    const { container } = renderWithTheme(
      <PettyCashBudgetFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
