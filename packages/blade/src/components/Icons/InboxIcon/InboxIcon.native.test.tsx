import renderWithTheme from '~utils/testing/renderWithTheme.native';

import InboxIcon from '.';

describe('<InboxIcon />', () => {
  it('should render InboxIcon', () => {
    const renderTree = renderWithTheme(
      <InboxIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
