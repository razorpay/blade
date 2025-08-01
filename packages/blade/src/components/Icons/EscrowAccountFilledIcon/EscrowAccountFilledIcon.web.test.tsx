import EscrowAccountFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<EscrowAccountFilledIcon />', () => {
  it('should render EscrowAccountFilledIcon', () => {
    const { container } = renderWithTheme(
      <EscrowAccountFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
