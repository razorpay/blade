import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TrademarkRegisteredIcon from './';

describe('<TrademarkRegisteredIcon />', () => {
  it('should render TrademarkRegisteredIcon', () => {
    const { container } = renderWithTheme(
      <TrademarkRegisteredIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
