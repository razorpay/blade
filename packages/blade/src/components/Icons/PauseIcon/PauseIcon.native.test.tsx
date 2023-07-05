import PauseIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PauseIcon />', () => {
  it('should render PauseIcon', () => {
    const renderTree = renderWithTheme(
      <PauseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
