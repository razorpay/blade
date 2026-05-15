import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TrademarkRegisteredIcon from '.';

describe('<TrademarkRegisteredIcon />', () => {
  it('should render TrademarkRegisteredIcon', () => {
    const renderTree = renderWithTheme(
      <TrademarkRegisteredIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
