import CoinIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CoinIcon />', () => {
  it('should render CoinIcon', () => {
    const { container } = renderWithTheme(
      <CoinIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
