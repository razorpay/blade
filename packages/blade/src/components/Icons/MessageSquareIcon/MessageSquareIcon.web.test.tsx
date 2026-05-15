import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MessageSquareIcon from './';

describe('<MessageSquareIcon />', () => {
  it('should render MessageSquareIcon', () => {
    const { container } = renderWithTheme(
      <MessageSquareIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
