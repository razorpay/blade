import TransactionIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<TransactionIcon />', () => {
  it('should render TransactionIcon', () => {
    const renderTree = renderWithTheme(
      <TransactionIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
