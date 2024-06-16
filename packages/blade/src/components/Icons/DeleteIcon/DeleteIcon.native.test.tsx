import DeleteIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<DeleteIcon />', () => {
  it('should render DeleteIcon', () => {
    const renderTree = renderWithTheme(
      <DeleteIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
