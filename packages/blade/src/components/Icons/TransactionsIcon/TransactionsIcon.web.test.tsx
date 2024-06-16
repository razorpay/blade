import TransactionsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TransactionsIcon />', () => {
  it('should render TransactionsIcon', () => {
    const { container } = renderWithTheme(
      <TransactionsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
