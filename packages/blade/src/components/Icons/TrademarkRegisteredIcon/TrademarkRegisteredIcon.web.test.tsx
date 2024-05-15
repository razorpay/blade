import TrademarkRegisteredIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TrademarkRegisteredIcon />', () => {
  it('should render TrademarkRegisteredIcon', () => {
    const { container } = renderWithTheme(
      <TrademarkRegisteredIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
