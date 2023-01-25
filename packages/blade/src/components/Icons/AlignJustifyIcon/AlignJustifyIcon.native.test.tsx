import AlignJustifyIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<AlignJustifyIcon />', () => {
  it('should render AlignJustifyIcon', () => {
    const renderTree = renderWithTheme(
      <AlignJustifyIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
