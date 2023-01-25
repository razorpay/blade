import ZoomInIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ZoomInIcon />', () => {
  it('should render ZoomInIcon', () => {
    const renderTree = renderWithTheme(
      <ZoomInIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
