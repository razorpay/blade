import TransactionsV1Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<TransactionsV1Icon />', () => {
  it('should render TransactionsV1Icon', () => {
    const { container } = renderWithTheme(
      <TransactionsV1Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
