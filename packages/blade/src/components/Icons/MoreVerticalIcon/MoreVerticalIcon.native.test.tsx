import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MoreVerticalIcon from '.';

describe('<MoreVerticalIcon />', () => {
  it('should render MoreVerticalIcon', () => {
    const renderTree = renderWithTheme(
      <MoreVerticalIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
