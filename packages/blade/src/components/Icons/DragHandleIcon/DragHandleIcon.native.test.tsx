import renderWithTheme from '~utils/testing/renderWithTheme.native';

import DragHandleIcon from '.';

describe('<DragHandleIcon />', () => {
  it('should render DragHandleIcon', () => {
    const renderTree = renderWithTheme(
      <DragHandleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
