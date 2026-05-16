import renderWithTheme from '~utils/testing/renderWithTheme.native';

import InstantSettlementIcon from '.';

describe('<InstantSettlementIcon />', () => {
  it('should render InstantSettlementIcon', () => {
    const renderTree = renderWithTheme(
      <InstantSettlementIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
