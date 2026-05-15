import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CodeSnippetIcon from '.';

describe('<CodeSnippetIcon />', () => {
  it('should render CodeSnippetIcon', () => {
    const renderTree = renderWithTheme(
      <CodeSnippetIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
