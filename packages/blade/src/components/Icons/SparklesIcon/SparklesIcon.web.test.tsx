import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SparklesIcon from './';

describe('<SparklesIcon />', () => {
  it('should render SparklesIcon', () => {
    const { container } = renderWithTheme(
      <SparklesIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
