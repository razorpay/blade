import TicketIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TicketIcon />', () => {
  it('should render TicketIcon', () => {
    const { container } = renderWithTheme(
      <TicketIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
