import MaximizeIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MaximizeIcon />', () => {
  it('should render MaximizeIcon', () => {
    const renderTree = renderWithTheme(
      <MaximizeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
