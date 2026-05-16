import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TriangleIcon from '.';

describe('<TriangleIcon />', () => {
  it('should render TriangleIcon', () => {
    const renderTree = renderWithTheme(
      <TriangleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
