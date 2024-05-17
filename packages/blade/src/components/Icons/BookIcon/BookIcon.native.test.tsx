import BookIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BookIcon />', () => {
  it('should render BookIcon', () => {
    const renderTree = renderWithTheme(
      <BookIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
