import InstantSettlementFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<InstantSettlementFilledIcon />', () => {
  it('should render InstantSettlementFilledIcon', () => {
    const { container } = renderWithTheme(
      <InstantSettlementFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
