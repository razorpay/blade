import TriangleIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TriangleIcon />', () => {
  it('should render TriangleIcon', () => {
    const renderTree = renderWithTheme(
      <TriangleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
