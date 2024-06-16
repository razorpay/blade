import SparklesIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SparklesIcon />', () => {
  it('should render SparklesIcon', () => {
    const renderTree = renderWithTheme(
      <SparklesIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
