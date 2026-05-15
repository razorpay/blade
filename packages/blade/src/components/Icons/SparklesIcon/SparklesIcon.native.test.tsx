import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SparklesIcon from '.';

describe('<SparklesIcon />', () => {
  it('should render SparklesIcon', () => {
    const renderTree = renderWithTheme(
      <SparklesIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
