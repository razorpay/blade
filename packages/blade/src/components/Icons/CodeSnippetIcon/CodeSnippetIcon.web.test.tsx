import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CodeSnippetIcon from './';

describe('<CodeSnippetIcon />', () => {
  it('should render CodeSnippetIcon', () => {
    const { container } = renderWithTheme(
      <CodeSnippetIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
