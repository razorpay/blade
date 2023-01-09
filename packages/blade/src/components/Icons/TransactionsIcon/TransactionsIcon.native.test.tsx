import TransactionsIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<TransactionsIcon />', () => {
  it('should render TransactionsIcon', () => {
    const renderTree = renderWithTheme(
      <TransactionsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
