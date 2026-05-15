import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TokenHqIcon from './';

describe('<TokenHqIcon />', () => {
  it('should render TokenHqIcon', () => {
    const { container } = renderWithTheme(
      <TokenHqIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
