import TransactionsIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<TransactionsIcon />', () => {
  it('should render TransactionsIcon', () => {
    const { container } = renderWithTheme(
      <TransactionsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
