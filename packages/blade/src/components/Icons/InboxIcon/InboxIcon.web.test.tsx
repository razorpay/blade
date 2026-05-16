import renderWithTheme from '~utils/testing/renderWithTheme.web';

import InboxIcon from './';

describe('<InboxIcon />', () => {
  it('should render InboxIcon', () => {
    const { container } = renderWithTheme(
      <InboxIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
