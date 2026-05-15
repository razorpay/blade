import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TrashIcon from '.';

describe('<TrashIcon />', () => {
  it('should render TrashIcon', () => {
    const renderTree = renderWithTheme(
      <TrashIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
