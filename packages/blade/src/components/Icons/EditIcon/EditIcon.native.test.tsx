import EditIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<EditIcon />', () => {
  it('should render EditIcon', () => {
    const renderTree = renderWithTheme(
      <EditIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
