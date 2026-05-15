import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SlackIcon from './';

describe('<SlackIcon />', () => {
  it('should render SlackIcon', () => {
    const { container } = renderWithTheme(
      <SlackIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
