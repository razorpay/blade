import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SolutionsIcon from './';

describe('<SolutionsIcon />', () => {
  it('should render SolutionsIcon', () => {
    const { container } = renderWithTheme(
      <SolutionsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
