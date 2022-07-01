import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import EditIcon from '.';

describe('<EditIcon />', () => {
  it('should render EditIcon', () => {
    const renderTree = renderWithTheme(
      <EditIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
