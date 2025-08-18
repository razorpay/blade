import SolutionsFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SolutionsFilledIcon />', () => {
  it('should render SolutionsFilledIcon', () => {
    const { container } = renderWithTheme(
      <SolutionsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
