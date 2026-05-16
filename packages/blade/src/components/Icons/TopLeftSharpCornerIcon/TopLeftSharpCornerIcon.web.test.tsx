import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TopLeftSharpCornerIcon from './';

describe('<TopLeftSharpCornerIcon />', () => {
  it('should render TopLeftSharpCornerIcon', () => {
    const { container } = renderWithTheme(
      <TopLeftSharpCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
