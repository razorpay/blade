import AlertTriangleIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AlertTriangleIcon />', () => {
  it('should render AlertTriangleIcon', () => {
    const renderTree = renderWithTheme(
      <AlertTriangleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
