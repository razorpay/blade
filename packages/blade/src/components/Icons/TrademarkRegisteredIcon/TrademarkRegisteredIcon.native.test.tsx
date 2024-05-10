import TrademarkRegisteredIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TrademarkRegisteredIcon />', () => {
  it('should render TrademarkRegisteredIcon', () => {
    const renderTree = renderWithTheme(
      <TrademarkRegisteredIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
