import renderWithTheme from '~utils/testing/renderWithTheme.web';

import HomeIcon from './';

describe('<HomeIcon />', () => {
  it('should render HomeIcon', () => {
    const { container } = renderWithTheme(
      <HomeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
