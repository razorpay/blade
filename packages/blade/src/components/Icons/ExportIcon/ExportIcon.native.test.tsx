import ExportIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ExportIcon />', () => {
  it('should render ExportIcon', () => {
    const renderTree = renderWithTheme(
      <ExportIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
