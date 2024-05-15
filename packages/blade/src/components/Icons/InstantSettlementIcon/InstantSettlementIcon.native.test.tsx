import InstantSettlementIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<InstantSettlementIcon />', () => {
  it('should render InstantSettlementIcon', () => {
    const renderTree = renderWithTheme(
      <InstantSettlementIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
