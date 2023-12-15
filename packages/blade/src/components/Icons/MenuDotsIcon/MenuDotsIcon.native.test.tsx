import MenuDotsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MenuDotsIcon />', () => {
  it('should render MenuDotsIcon', () => {
    const renderTree = renderWithTheme(
      <MenuDotsIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
