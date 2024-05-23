import TicketIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TicketIcon />', () => {
  it('should render TicketIcon', () => {
    const renderTree = renderWithTheme(
      <TicketIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
