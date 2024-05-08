import TrademarkIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TrademarkIcon />', () => {
  it('should render TrademarkIcon', () => {
    const { container } = renderWithTheme(
      <TrademarkIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
