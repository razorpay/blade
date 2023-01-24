import AlignRightIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<AlignRightIcon />', () => {
  it('should render AlignRightIcon', () => {
    const renderTree = renderWithTheme(
      <AlignRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
