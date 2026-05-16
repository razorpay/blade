import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SolutionsFilledIcon from '.';

describe('<SolutionsFilledIcon />', () => {
  it('should render SolutionsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <SolutionsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
