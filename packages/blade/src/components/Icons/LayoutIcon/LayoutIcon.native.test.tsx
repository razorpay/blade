import LayoutIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<LayoutIcon />', () => {
  it('should render LayoutIcon', () => {
    const renderTree = renderWithTheme(
      <LayoutIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
