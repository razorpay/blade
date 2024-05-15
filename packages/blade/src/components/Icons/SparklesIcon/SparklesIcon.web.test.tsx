import SparklesIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SparklesIcon />', () => {
  it('should render SparklesIcon', () => {
    const { container } = renderWithTheme(
      <SparklesIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
