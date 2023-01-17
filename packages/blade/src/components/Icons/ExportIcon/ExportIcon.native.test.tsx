import ExportIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ExportIcon />', () => {
  it('should render ExportIcon', () => {
    const renderTree = renderWithTheme(
      <ExportIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
