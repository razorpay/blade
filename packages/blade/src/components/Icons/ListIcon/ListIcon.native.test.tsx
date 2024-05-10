import ListIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ListIcon />', () => {
  it('should render ListIcon', () => {
    const renderTree = renderWithTheme(
      <ListIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
