import AlignJustifyIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AlignJustifyIcon />', () => {
  it('should render AlignJustifyIcon', () => {
    const renderTree = renderWithTheme(
      <AlignJustifyIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
