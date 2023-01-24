import TriangleIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<TriangleIcon />', () => {
  it('should render TriangleIcon', () => {
    const renderTree = renderWithTheme(
      <TriangleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
