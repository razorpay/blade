import CropIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CropIcon />', () => {
  it('should render CropIcon', () => {
    const renderTree = renderWithTheme(
      <CropIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
