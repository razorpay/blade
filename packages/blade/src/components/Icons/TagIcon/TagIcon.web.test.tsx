import TagIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<TagIcon />', () => {
  it('should render TagIcon', () => {
    const { container } = renderWithTheme(
      <TagIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
