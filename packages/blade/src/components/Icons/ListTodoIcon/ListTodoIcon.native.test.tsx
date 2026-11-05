import ListTodoIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ListTodoIcon />', () => {
  it('should render ListTodoIcon', () => {
    const renderTree = renderWithTheme(
      <ListTodoIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
