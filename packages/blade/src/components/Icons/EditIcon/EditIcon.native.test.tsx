import EditIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<EditIcon />', () => {
  it('should render EditIcon', () => {
    const renderTree = renderWithTheme(
      <EditIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
