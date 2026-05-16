import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TwitterIcon from './';

describe('<TwitterIcon />', () => {
  it('should render TwitterIcon', () => {
    const { container } = renderWithTheme(
      <TwitterIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
