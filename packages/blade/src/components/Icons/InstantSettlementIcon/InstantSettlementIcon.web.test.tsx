import InstantSettlementIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<InstantSettlementIcon />', () => {
  it('should render InstantSettlementIcon', () => {
    const { container } = renderWithTheme(
      <InstantSettlementIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
