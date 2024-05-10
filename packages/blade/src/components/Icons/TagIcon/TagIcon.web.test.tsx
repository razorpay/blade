import TagIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TagIcon />', () => {
  it('should render TagIcon', () => {
    const { container } = renderWithTheme(
      <TagIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
