import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TicketIcon from '.';

describe('<TicketIcon />', () => {
  it('should render TicketIcon', () => {
    const renderTree = renderWithTheme(
      <TicketIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
