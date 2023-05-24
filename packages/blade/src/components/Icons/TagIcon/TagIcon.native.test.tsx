import TagIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TagIcon />', () => {
  it('should render TagIcon', () => {
    const renderTree = renderWithTheme(
      <TagIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
