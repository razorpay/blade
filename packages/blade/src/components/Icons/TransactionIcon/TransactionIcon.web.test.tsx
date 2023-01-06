import TransactionIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<TransactionIcon />', () => {
  it('should render TransactionIcon', () => {
    const { container } = renderWithTheme(
      <TransactionIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
