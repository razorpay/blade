import BookIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BookIcon />', () => {
  it('should render BookIcon', () => {
    const { container } = renderWithTheme(
      <BookIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
