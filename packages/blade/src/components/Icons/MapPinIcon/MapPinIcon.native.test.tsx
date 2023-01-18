import MapPinIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<MapPinIcon />', () => {
  it('should render MapPinIcon', () => {
    const renderTree = renderWithTheme(
      <MapPinIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
