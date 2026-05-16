import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CoinIcon from './';

describe('<CoinIcon />', () => {
  it('should render CoinIcon', () => {
    const { container } = renderWithTheme(
      <CoinIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
