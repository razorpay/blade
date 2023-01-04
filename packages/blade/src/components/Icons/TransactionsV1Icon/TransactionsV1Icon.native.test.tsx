import TransactionsV1Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<TransactionsV1Icon />', () => {
  it('should render TransactionsV1Icon', () => {
    const renderTree = renderWithTheme(
      <TransactionsV1Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
