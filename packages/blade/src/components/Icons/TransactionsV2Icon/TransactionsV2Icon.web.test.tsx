import TransactionsV2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<TransactionsV2Icon />', () => {
  it('should render TransactionsV2Icon', () => {
    const { container } = renderWithTheme(
      <TransactionsV2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
