import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TransactionsIcon from './';

describe('<TransactionsIcon />', () => {
  it('should render TransactionsIcon', () => {
    const { container } = renderWithTheme(
      <TransactionsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
