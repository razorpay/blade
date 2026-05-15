import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ThumbsDownIcon from './';

describe('<ThumbsDownIcon />', () => {
  it('should render ThumbsDownIcon', () => {
    const { container } = renderWithTheme(
      <ThumbsDownIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
