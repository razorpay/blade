import ListTodoIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ListTodoIcon />', () => {
  it('should render ListTodoIcon', () => {
    const { container } = renderWithTheme(
      <ListTodoIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
