import CodeSnippetIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CodeSnippetIcon />', () => {
  it('should render CodeSnippetIcon', () => {
    const { container } = renderWithTheme(
      <CodeSnippetIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
