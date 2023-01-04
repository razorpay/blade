import TransactionsV2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<TransactionsV2Icon />', () => {
  it('should render TransactionsV2Icon', () => {
    const renderTree = renderWithTheme(
      <TransactionsV2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
