import SolutionsFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SolutionsFilledIcon />', () => {
  it('should render SolutionsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <SolutionsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
