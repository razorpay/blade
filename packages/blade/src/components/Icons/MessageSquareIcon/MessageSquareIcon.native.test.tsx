import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MessageSquareIcon from '.';

describe('<MessageSquareIcon />', () => {
  it('should render MessageSquareIcon', () => {
    const renderTree = renderWithTheme(
      <MessageSquareIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
