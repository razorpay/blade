import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SlackIcon from '.';

describe('<SlackIcon />', () => {
  it('should render SlackIcon', () => {
    const renderTree = renderWithTheme(
      <SlackIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
