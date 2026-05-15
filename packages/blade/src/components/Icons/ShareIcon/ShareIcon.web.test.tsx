import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ShareIcon from './';

describe('<ShareIcon />', () => {
  it('should render ShareIcon', () => {
    const { container } = renderWithTheme(
      <ShareIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
