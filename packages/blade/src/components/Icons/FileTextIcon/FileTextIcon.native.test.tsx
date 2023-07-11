import FileTextIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FileTextIcon />', () => {
  it('should render FileTextIcon', () => {
    const renderTree = renderWithTheme(
      <FileTextIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
