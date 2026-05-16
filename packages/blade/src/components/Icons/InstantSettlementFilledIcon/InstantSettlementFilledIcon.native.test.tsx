import renderWithTheme from '~utils/testing/renderWithTheme.native';

import InstantSettlementFilledIcon from '.';

describe('<InstantSettlementFilledIcon />', () => {
  it('should render InstantSettlementFilledIcon', () => {
    const renderTree = renderWithTheme(
      <InstantSettlementFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
