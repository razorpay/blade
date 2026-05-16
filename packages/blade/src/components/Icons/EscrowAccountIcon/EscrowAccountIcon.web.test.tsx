import renderWithTheme from '~utils/testing/renderWithTheme.web';

import EscrowAccountIcon from './';

describe('<EscrowAccountIcon />', () => {
  it('should render EscrowAccountIcon', () => {
    const { container } = renderWithTheme(
      <EscrowAccountIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
