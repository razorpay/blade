import MenuDotsIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<MenuDotsIcon />', () => {
  it('should render MenuDotsIcon', () => {
    const renderTree = renderWithTheme(
      <MenuDotsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
