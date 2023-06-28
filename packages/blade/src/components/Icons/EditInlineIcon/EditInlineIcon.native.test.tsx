import EditInlineIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<EditInlineIcon />', () => {
  it('should render EditInlineIcon', () => {
    const renderTree = renderWithTheme(
      <EditInlineIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
