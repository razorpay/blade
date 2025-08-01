import InstantSettlementFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<InstantSettlementFilledIcon />', () => {
  it('should render InstantSettlementFilledIcon', () => {
    const renderTree = renderWithTheme(
      <InstantSettlementFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
