import SolutionsIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SolutionsIcon />', () => {
  it('should render SolutionsIcon', () => {
    const renderTree = renderWithTheme(
      <SolutionsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
