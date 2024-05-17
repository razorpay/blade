import TrademarkIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TrademarkIcon />', () => {
  it('should render TrademarkIcon', () => {
    const renderTree = renderWithTheme(
      <TrademarkIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
